import json
import os
import traceback
from datetime import datetime
from typing import List

import requests

import engines
from db import Discovery, Query, Action, db_type
from entities.item import Item
from util import get_project_dir

VK_BACKEND_URL = os.environ.get('VK_BACKEND_URL') or 'http://localhost:18001/api'
CONFIG_DIR = f'{get_project_dir()}../data'
CONFIG_FILE = f'{CONFIG_DIR}/vk-config.json'


def insert(items: List[Item], device_id: int) -> None:
    for count, r in enumerate(items):
        existing_discovery = Discovery.get_or_none(Discovery.ip == r.ip)

        try:
            status = "Updating" if existing_discovery else "Inserting"
            print(f"{status} discovery ({r.url})")
            tags = ','.join([str(t) for t in r.tags]) if r.tags else ''
            new_discovery = Discovery.insert(url=r.url,
                                             ip=r.ip,
                                             device_id=device_id,
                                             tags=tags,
                                             full_data=r.full_data,
                                             source=r.source,
                                             last_updated=datetime.now()) \
                .on_conflict(conflict_target={Discovery.ip} if db_type != 'mysql' else None,
                             update={Discovery.url: r.url, Discovery.device_id: device_id, Discovery.tags: tags,
                                     Discovery.full_data: r.full_data, Discovery.source: r.source}).execute()
        except Exception:
            traceback.print_exc()
            continue

        if not existing_discovery:
            device_actions = Action.select().where(((Action.device_id.is_null(True)) | (Action.device_id == device_id)) & (Action.execute_on_discovery == True))
            for action in device_actions:
                try:
                    requests.get(f'{VK_BACKEND_URL}/discovery/{new_discovery}/action/{action.id}',
                                 timeout=10).raise_for_status()
                    print(f"Executed action {action.id} '{action.title}' for device {device_id}")
                except requests.exceptions.RequestException:
                    print(
                        f"Failed to execute action {action.id} '{action.title}' for device {device_id}: {traceback.format_exc()}")


def get_engine_config(engine: str) -> tuple:
    with open(CONFIG_FILE, 'r') as f:
        json_config = json.load(f)
        engines = {k.lower(): v for k, v in json_config['engines'].items()}
        api_key = engines[engine]['api_key']
        tag_attributes = engines[engine].get('tag_attributes') or []
        return api_key, tag_attributes


def run_engine():
    searches = Query.select().where(Query.enabled != False)

    if not searches:
        print("Nothing to do: either there are no devices or all queries are disabled")
        return

    for s in searches:
        print(f'Searching: "{s.query}" @ {s.engine}')
        engine_name = s.engine.lower()
        try:
            api_key, tag_attributes = get_engine_config(engine_name)
        except KeyError:
            print(f"API key is missing from config file {CONFIG_FILE} or the file is malformed")
            continue

        try:
            engine = getattr(engines, f"_{engine_name}")
        except AttributeError:
            print(f"Engine {engine_name} not implemented: {traceback.format_exc()}")
            continue

        try:
            results = engine.search(api_key, s.query, tag_attributes)
        except Exception:
            print(f"Query {s.query} failed: {traceback.format_exc()}")
            continue

        insert(results, s.device_id)


if __name__ == '__main__':
    if not os.path.exists(CONFIG_FILE):
        raise Exception("To edit your config for the first time, go to the Settings page, add API keys, and save.")
    run_engine()