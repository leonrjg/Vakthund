#!/usr/bin/python3
import base64
import json
import os
from typing import List
import requests

from util import get_attr_by_path, get_project_dir
from entities.item import Item


def search(query: str, config: dict) -> List[Item]:
    """
    Search FOFA using their API.

    Based on official FOFA API documentation at https://fofa.so/api/v1/

    Args:
        config: Engine configuration dictionary
        query: FOFA search query (e.g., 'title="bing"' or 'ip="103.35.168.38"')

    Returns:
        List of Item objects containing search results
    """
    api_key = config.get('api_key')
    tag_attributes: List[str] = config.get('tag_attributes', [])

    # Encode query to base64 as required by FOFA API
    qbase64 = base64.b64encode(query.encode('utf-8')).decode('utf-8')

    # Define fields to retrieve - default is host,ip,port
    fields = config.get('fields')

    # Build API request URL
    url = "https://fofa.so/api/v1/search/all"
    params = {
        'key': api_key,
        'qbase64': qbase64,
        'fields': ','.join(fields),
        'r_type': 'json',
    }

    response = requests.get(url, params=params, timeout=60)
    response.raise_for_status()

    data = response.json()

    # Check for errors - FOFA returns {"error": false} on success
    if data.get('error', False):
        raise Exception(f"FOFA API error: {data}")

    output = []
    for result in data.get('results', []):
        host = result.get('host') or ''
        ip = result.get('ip') or ''
        port_str = result.get('port') or ''
        protocol = result.get('protocol') or ''

        url_str = host
        if protocol:
            url_str = f"{protocol}://{ip}:{port_str}"

        item = Item(
            url=url_str,
            ip=ip,
            port=int(port_str),
            tags=[get_attr_by_path(result, a) for a in tag_attributes],
            full_data=json.dumps(result),
            source=os.path.basename(__file__)
        )
        output.append(item)

    return output
