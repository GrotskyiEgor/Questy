import os
from flask import Flask
from secrets import token_bytes
from dotenv import load_dotenv
from flask_mail import Mail
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect

load_dotenv()

GOOGLE_APP_KEY= os.getenv("GOOGLE_APP_KEY")
PROJECT_SECRET_KEY= os.getenv("PROJECT_SECRET_KEY")

project = Flask(
    import_name=__name__,
    static_folder="static",
    static_url_path="/Project/",
    template_folder="templates",
    instance_path=os.path.abspath(os.path.join(__file__, '..', 'instance'))
)

project.config['SECRET_KEY']= PROJECT_SECRET_KEY

csrf = CSRFProtect()
csrf.init_app(project)

project.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME='egor115819@gmail.com',
    MAIL_PASSWORD=GOOGLE_APP_KEY,
)

mail = Mail(project)
socketio = SocketIO(project, cors_allowed_origins="*")

