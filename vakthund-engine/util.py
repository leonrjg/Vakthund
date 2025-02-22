import json
import os


def get_attr_by_path(o, path):
    parts = path.split('.')
    current = o
    for p in parts:
        current = current.get(p)
        if not current:
            break
    return current


def get_project_dir() -> str:
    return os.path.dirname(os.path.abspath(__file__)) + os.sep
