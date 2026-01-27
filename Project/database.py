import os
import flask_migrate
import flask_sqlalchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine

from .settings import project

project.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

db = flask_sqlalchemy.SQLAlchemy(project)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

migrate = flask_migrate.Migrate(
    app=project, 
    db=db,
    directory=os.path.abspath(os.path.join(__file__, "..", "migrations"))
    )

