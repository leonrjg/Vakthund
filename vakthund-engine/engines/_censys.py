#!/usr/bin/python3
import json
import os
from typing import List

from censys_platform import SDK

from util import get_attr_by_path, get_project_dir
from entities.item import Item


def search(api_key: str, query: str, tag_attributes: List[str]) -> list[Item]:
    with SDK(
        personal_access_token=api_key,
    ) as sdk:
        response = sdk.global_data.search(search_query_input_body={
            "query": query,
            "page_size": 100,
        })

        print(response)

        output = []
        for hit in response.result.result.hits:
            if hit.host_v1 is None:
                print("Skipping non-host hit: ", hit)
                continue

            host_asset = hit.host_v1
            host = host_asset.resource
            ip = host.ip or ''

            port = ''
            if host_asset.matched_services:
                port = host_asset.matched_services[0].port
            elif host.services:
                port = host.services[0].port

            item = Item(
                url=f"http://{ip}:{port}/",
                ip=ip,
                port=port,
                tags=[get_attr_by_path(host_asset, a) for a in tag_attributes],
                full_data=json.dumps(host_asset, default=str),
                source=os.path.basename(__file__)
            )
            output.append(item)

        return output
