import flask 

user_app = flask.Blueprint(
    name='user_app',
    import_name="user_app",
    static_folder='static',
    template_folder='templates',
    static_url_path='/user_app/static/'
)