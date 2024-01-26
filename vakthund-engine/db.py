import os
from peewee import MySQLDatabase, PostgresqlDatabase, SqliteDatabase, TextField, DateTimeField, Model

from util import get_project_dir

db_type, name, host, user, password = os.environ.get('db_type'), os.environ.get('db_name'), os.environ.get('db_host'), \
                                      os.environ.get('db_user'), os.environ.get('db_password')

if db_type == 'mysql':
    db = MySQLDatabase(name, host=host, user=user, password=password)
elif db_type == 'postgres':
    db = PostgresqlDatabase(name, host=host, user=user, password=password)
else:
    db = SqliteDatabase(str.format(f"{get_project_dir()}../vakthund.db"))


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

    class Meta:
        database = db
        table_name = 'vakthund_queries'


db.create_tables([Discovery, Query])
