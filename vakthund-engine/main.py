import json
import traceback
from datetime import datetime
from typing import List

import engines
from db import Discovery, Query
from entities.item import Item
from util import get_project_dir

CONFIG_FILE = f'{get_project_dir()}../config/vk-config.json'
MAX_ACTIONS_PER_QUERY = 3


def insert(items: List[Item], device_id: int) -> None:
    for count, r in enumerate(items):
        existing_discovery = Discovery.get_or_none(Discovery.ip == r.ip)

        try:
            status = "Updating" if existing_discovery else "Inserting"
            print(f"{status} discovery ({r.url})")
            tags = ','.join(r.tags)
            Discovery.insert(url=r.url,
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
            # send action
            continue

def get_engine_config(engine: str) -> tuple:
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
        api_key = config['engines'][engine]['api_key']
        tag_attributes = config['engines'][engine].get('tag_attributes') or []
        return api_key, tag_attributes

def run_engine():
    searches = Query.select()
    for s in searches:
        print(f"Searching: {s.query} @ {s.engine}")
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
