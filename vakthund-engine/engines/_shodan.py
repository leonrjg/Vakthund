#!/usr/bin/python3
import json
import os
from typing import List

import shodan

from util import get_attr_by_path, get_project_dir
from entities.item import Item


def search(query: str, config: dict) -> List[Item]:
    api_key = config.get('api_key')
    tag_attributes: List[str] = config.get('tag_attributes', [])

    api = shodan.Shodan(api_key)
    results = api.search(query)

    output = []
    for r in results['matches']:
        item = Item(
            url=f"http://{r['ip_str']}:{r['port']}/",
            ip=r['ip_str'],
            port=r['port'],
            tags=[get_attr_by_path(r, a) for a in tag_attributes],
            full_data=json.dumps(r),
            source=os.path.basename(__file__)
        )
        output.append(item)

    return output