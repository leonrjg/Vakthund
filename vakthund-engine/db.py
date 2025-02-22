import os
from peewee import MySQLDatabase, PostgresqlDatabase, SqliteDatabase, TextField, DateTimeField, Model, BooleanField

from util import get_project_dir

db_type, name, host, user, password = os.environ.get('db_type'), os.environ.get('db_name'), os.environ.get('db_host'), \
                                      os.environ.get('db_user'), os.environ.get('db_password')

if db_type == 'mysql':
    db = MySQLDatabase(name, host=host, user=user, password=password)
elif db_type == 'postgres':
    db = PostgresqlDatabase(name, host=host, user=user, password=password)
else:
    db_dir = str.format(f"{get_project_dir()}../data")
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    db = SqliteDatabase(db_dir + '/vakthund.db',  timeout=15)


class Discovery(Model):
    alias = TextField(null=True)
    url = TextField(unique=True)
    ip = TextField(unique=True)
    device_id = TextField()
    tags = TextField()
    full_data = TextField()
    source = TextField()
    last_updated = DateTimeField()

    class Meta:
        database = db
        table_name = 'vakthund_discoveries'


class Query(Model):
    device_id = TextField(null=False)
    query = TextField(null=False)
    engine = TextField()
    enabled = BooleanField()

    class Meta:
        database = db
        table_name = 'vakthund_queries'


class Action(Model):
    device_id = TextField()
    title = TextField(null=False)
    cmd = TextField(null=False)
    execute_on_discovery = BooleanField()

    class Meta:
        database = db
        table_name = 'vakthund_actions'


# db.create_tables([Discovery, Query, Action])
