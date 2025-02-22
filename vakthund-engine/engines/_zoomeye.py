#!/usr/bin/python3
import json
import os
from typing import List
from zoomeyeai.sdk import ZoomEye
from util import get_attr_by_path, get_project_dir
from entities.item import Item


def search(api_key: str, query: str, tag_attributes: List[str]) -> list[Item]:
    zm = ZoomEye(api_key=api_key)
    results = zm.search(query, fields='ip, port, domain, update_time, province.name, city.name, rdns, hostname')

    output = []
    for r in results['data']:
        item = Item(
            url=f"http://{r['ip']}:{r['port']}/",
            ip=r['ip'],
            port=r['port'],
            tags=[get_attr_by_path(r, a) for a in tag_attributes],
            full_data=json.dumps(r),
            source=os.path.basename(__file__)
        )
        output.append(item)

    return output
