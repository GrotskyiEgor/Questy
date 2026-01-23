import flask, dotenv, os, secrets

from flask_mail import Mail
from flask_socketio import SocketIO
from flask_wtf import CSRFProtect

dotenv.load_dotenv()

GOOGLE_APP_KEY= os.getenv("GOOGLE_APP_KEY")

project = flask.Flask(
    import_name = __name__,
    static_folder="static",
    static_url_path="/Project/",
    template_folder="templates",
    instance_path= os.path.abspath(os.path.join(__file__, '..', 'instance'))
)

project.config['SECRET_KEY']= 'nothing'

csrf= CSRFProtect()
csrf.init_app(project)

# instance_path= os.path.abspath(os.path.join(__file__, '..', '..', 'instance'))

project.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME='egor115819@gmail.com',
    MAIL_PASSWORD= GOOGLE_APP_KEY,
)
project.secret_key = secrets.token_bytes()

mail = Mail(project)
socketio = SocketIO(project, cors_allowed_origins="*")

