import os
import flask_migrate
import flask_sqlalchemy

from .settings import project

project.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

db = flask_sqlalchemy.SQLAlchemy(project)

migrate = flask_migrate.Migrate(
    app=project, 
    db=db,
    directory=os.path.abspath(os.path.join(__file__, "..", "migrations"))
    )