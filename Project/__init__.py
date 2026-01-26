from .urls import *
from .token_manage import *
from .settings import project,socketio
from .loadenv import load_env
from .login_manager import *
from .clear_cookie import clear_cookies
from .database import db

project.register_blueprint(blueprint = home_app)
project.register_blueprint(blueprint = sign_up_app)
project.register_blueprint(blueprint= test_app)
project.register_blueprint(blueprint= class_app)

from .render_page import render_page