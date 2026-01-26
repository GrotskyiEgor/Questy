import flask

class_app = flask.Blueprint(
    name='class_app',
    import_name="class_app",
    static_folder='static',
    static_url_path='/class_app/static',
    template_folder='templates'
)



