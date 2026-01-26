import flask

from test_app.models import Room, Test
from Project.render_page import render_page


def loguot():
    flask.session.clear()
    return flask.redirect("/")


def get_codes():
    list_room = Room.query.all()
    code_list = []

    for room in list_room:
        if room.test_code != 0 and not room.active_test:
            code_list.append(str(room.test_code))
    
    return flask.jsonify(code_list)


@render_page(template_name='home.html')
def render_home():
    list_room = []
    list_tests = []

    try:
        list_room = Room.query.all()
        list_tests = Test.query.all()
    except:
        pass

    return {
        "list_room": list_room,
        "list_tests": list_tests
    }

