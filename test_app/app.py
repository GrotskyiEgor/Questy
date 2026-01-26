import flask 

test_app = flask.Blueprint(
    name='test_app',
    import_name='test_app',
    template_folder='templates',
    static_folder='static',
    static_url_path='/test_app/static'
)