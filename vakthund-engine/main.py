import json
import os
import traceback
from datetime import datetime
from typing import List
from shutil import copyfile

import requests

import engines
from db import Discovery, Query, Action
from entities.item import Item
from util import get_project_dir

VK_BACKEND_URL = 'http://localhost:18001/api'
CONFIG_DIR = f'{get_project_dir()}../config'
CONFIG_FILE = f'{CONFIG_DIR}/vk-config.json'
CONFIG_SAMPLE_FILE = f'{CONFIG_DIR}/vk-config-sample.json'
MAX_ACTIONS_PER_QUERY = 3


def insert(items: List[Item], device_id: int) -> None:
    for count, r in enumerate(items):
        existing_discovery = Discovery.get_or_none(Discovery.ip == r.ip)

        try:
            status = "Updating" if existing_discovery else "Inserting"
            print(f"{status} discovery ({r.url})")
            tags = ','.join(r.tags)
            new_discovery = Discovery.insert(url=r.url,
                                             ip=r.ip,
                                             device_id=device_id,
                                             tags=tags,
                                             full_data=r.full_data,
                                             source=r.source,
                                             last_updated=datetime.now()) \
                .on_conflict(conflict_target={Discovery.ip},
                             update={Discovery.url: r.url, Discovery.device_id: device_id, Discovery.tags: tags,
                                     Discovery.full_data: r.full_data, Discovery.source: r.source,
                                     Discovery.last_updated: datetime.now()}).execute()
        except Exception:
            traceback.print_exc()
            continue

        if not existing_discovery and count < MAX_ACTIONS_PER_QUERY:
            device_actions = Action.select().where(Action.device_id == device_id, Action.execute_on_discovery == True)
            for action in device_actions:
                try:
                    requests.get(f'{VK_BACKEND_URL}/discovery/{new_discovery}/action/{action.id}',
                                 timeout=10).raise_for_status()
                    print(f"Executed action {action.id} '{action.title}' for device {device_id}")
                except requests.exceptions.RequestException:
                    print(
                        f"Failed to execute action {action.id} '{action.title}' for device {device_id}: {traceback.format_exc()}")


def get_engine_config(engine: str) -> tuple:
    if not os.path.exists(CONFIG_FILE):
        copyfile(CONFIG_SAMPLE_FILE, CONFIG_FILE)

    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
        api_key = config['engines'][engine]['api_key']
        tag_attributes = config['engines'][engine].get('tag_attributes') or []
        return api_key, tag_attributes


def run_engine():
    searches = Query.select()
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
    run_engine()
