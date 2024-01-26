#!/usr/bin/python3
import json
import os
from typing import List
from zoomeye.sdk import ZoomEye
from util import get_attr_by_path, get_project_dir, get_mock
from entities.item import Item

ENGINE_NAME = "zoomeye"


def search(api_key: str, query: str, tag_attributes: List[str]) -> list[Item]:
    if os.environ.get('USE_MOCKS'):
        results = get_mock(ENGINE_NAME)
    else:
        zm = ZoomEye(api_key=api_key)
        results = zm.dork_search(query)

    output = []
    for r in results:
        port = get_attr_by_path(r, 'portinfo.port')
        item = Item(
            url=f"http://{r['ip']}:{port}/",
            ip=r['ip'],
            port=port,
            tags=[get_attr_by_path(r, a) for a in tag_attributes],
            full_data=json.dumps(r),
            source=ENGINE_NAME
        )
        output.append(item)

    return output
