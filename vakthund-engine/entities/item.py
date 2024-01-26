from typing import List


class Item:
    def __init__(self, url: str, ip: str, port: int, tags: List[str], full_data: str, source: str):
        self.url = url
        self.ip = ip
        self.port = port
        self.tags = tags
        self.full_data = full_data
        self.source = source

    def __repr__(self):
        return str((self.url, self.ip, self.port, self.tags, self.full_data, self.source))
