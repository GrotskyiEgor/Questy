import os
import dotenv

PATH = os.path.abspath(os.path.join(__file__))

def load_env():
    ENV_PATH = os.path.abspath(os.path.join(__file__, "..", "..", ".env"))
    if os.path.exists(ENV_PATH):
        dotenv.load_dotenv(dotenv_path= ENV_PATH)
    if not os.path.exists(os.path.join(PATH, "Project", "migrations")):
        os.system(os.environ["INIT_COMMAND"])
    
    os.system(os.environ["MIGRATE_COMMAND"])
    os.system(os.environ["UPGRADE_COMMAND"])
