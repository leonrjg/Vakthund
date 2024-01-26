#!/usr/bin/python3
import json
import os
from typing import List

import shodan

from util import get_attr_by_path, get_project_dir, get_mock
from entities.item import Item

ENGINE_NAME = "shodan"


def search(api_key: str, query: str, tag_attributes: List[str]) -> list[Item]:
    if os.environ.get('USE_MOCKS'):
        results = get_mock(ENGINE_NAME)
    else:
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
            source=ENGINE_NAME
        )
        output.append(item)

    return output
