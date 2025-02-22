import os
import sys
import unittest
from unittest.mock import patch, mock_open, ANY, Mock
from datetime import datetime
from peewee import IntegrityError

sys.path.append(os.getcwd())

from db import Query
from entities.item import Item
from main import insert, Discovery, get_engine_config, run_engine

class TestMain(unittest.TestCase):
    @patch('main.datetime')
    @patch('main.Discovery.insert')
    @patch('main.Discovery.get_or_none')
    @patch('main.Action.select')
    @patch('main.MAX_ACTIONS_PER_QUERY', 5)
    def test_insert_new_discovery(self, mock_datetime, mock_get_or_none, mock_insert, mock_action_select):
        mock_datetime.now.return_value = datetime(2022, 1, 1)
        mock_get_or_none.return_value = None
        mock_action_select.return_value = []

        items = [Item(ip='192.168.1.1', port=80, url='http://example.com', tags=['tag1', 'tag2'], full_data='data', source='source')]
        device_id = 123
        insert(items, device_id)
        mock_insert.assert_called_with(url='http://example.com', ip='192.168.1.1', device_id=device_id, tags='tag1,tag2',
                                       full_data='data', source='source', last_updated=ANY)

    @patch('main.Discovery.get_or_none')
    @patch('main.Discovery.insert')
    @patch('main.datetime')
    @patch('main.MAX_ACTIONS_PER_QUERY', 5)
    def test_update_existing_discovery(self, mock_datetime, mock_insert, mock_get_or_none):
        mock_datetime.now.return_value = datetime(2022, 1, 1)
        mock_get_or_none.return_value = Discovery(url='http://example.com', ip='192.168.1.1')
        items = [
            Item(ip='192.168.1.1', url='http://example.com', port=80, tags=['tag1', 'tag2'], full_data='data', source='source')]
        device_id = 123
        insert(items, device_id)
        mock_insert.assert_called_with(url='http://example.com', ip='192.168.1.1', device_id=123, tags='tag1,tag2',
                                       full_data='data', source='source',
                                       last_updated=datetime(2022, 1, 1))

    @patch('main.Discovery.get_or_none')
    @patch('main.Discovery.insert')
    @patch('main.datetime')
    @patch('main.traceback.print_exc')
    @patch('main.MAX_ACTIONS_PER_QUERY', 5)
    def test_handle_exceptions(self, mock_traceback, mock_datetime, mock_insert, mock_get_or_none):
        mock_datetime.now.return_value = datetime(2022, 1, 1)
        mock_get_or_none.return_value = None
        mock_insert.side_effect = IntegrityError
        items = [
            Item(ip='192.168.1.1', url='http://example.com', port=80, tags=['tag1', 'tag2'], full_data='data', source='source')]
        device_id = 123
        insert(items, device_id)
        mock_traceback.assert_called()

    @patch('builtins.open', new_callable=mock_open,
           read_data='{"engines": {"engine1": {"api_key": "123", "tag_attributes": ["tag1", "tag2"]}}}')
    def test_get_engine_config_with_tag_attributes(self, mock_file):
        api_key, tag_attributes = get_engine_config('engine1')
        self.assertEqual(api_key, '123')
        self.assertEqual(tag_attributes, ['tag1', 'tag2'])

    @patch('builtins.open', new_callable=mock_open, read_data='{"engines": {"engine2": {"api_key": "456"}}}')
    def test_get_engine_config_without_tag_attributes(self, mock_file):
        api_key, tag_attributes = get_engine_config('engine2')
        self.assertEqual(api_key, '456')
        self.assertEqual(tag_attributes, [])

    @patch('main.Query.select')
    @patch('main.get_engine_config')
    @patch('main.getattr')
    @patch('main.insert')
    def test_run_engine_success(self, mock_insert, mock_getattr, mock_get_engine_config, mock_query_select):
        mock_query_select.return_value = [Query(query="test_query", device_id=1, engine="TestEngine")]
        mock_get_engine_config.return_value = ("test_api_key", {"tag": "value"})
        mock_getattr.return_value = Mock(search=Mock(return_value=[]))
        run_engine()
        mock_insert.assert_any_call([], 1)

    @patch('main.Query.select')
    @patch('main.get_engine_config')
    @patch('main.insert')
    def test_run_engine_missing_api_key(self, mock_insert, mock_get_engine_config, mock_query_select):
        # Testing for missing API key in config file
        mock_query_select.return_value = [Query(query="test_query", engine="example")]
        mock_get_engine_config.side_effect = KeyError
        run_engine()
        mock_insert.assert_not_called()

    @patch('main.Query.select')
    @patch('main.get_engine_config')
    @patch('main.getattr')
    @patch('main.insert')
    def test_run_engine_missing_engine_impl(self, mock_insert, mock_search, mock_get_engine_config, mock_query_select):
        # Testing for missing engine implementation
        mock_query_select.return_value = [Query(query="test_query", engine="example")]
        mock_get_engine_config.return_value = ("test_api_key", {"tag": "value"})
        mock_search.side_effect = AttributeError
        run_engine()
        mock_insert.assert_not_called()

    @patch('main.Query.select')
    @patch('main.get_engine_config')
    @patch('main.getattr')
    @patch('main.insert')
    def test_run_engine_query_failure(self, mock_insert, mock_getattr, mock_get_engine_config, mock_query_select):
        # Testing for query failure
        mock_query_select.return_value = [Query(query="test_query", engine="example")]
        mock_get_engine_config.return_value = ("test_api_key", {"tag": "value"})
        mock_getattr.return_value = Mock(search=Mock(side_effect=Exception))
        run_engine()
        mock_insert.assert_not_called()

if __name__ == '__main__':
    unittest.main()