import flask

from Project.database import db
from test_app.models import Room, Test
from Project.render_page import render_page

def set_room_test(code):
    data = flask.request.get_json()
    value = data.get('value')
    typeChange = data.get('type')

    ROOM = Room.query.filter_by(test_code=code).first()
    TEST = Test.query.filter_by(id=ROOM.test_id).first()

    if TEST:
        if typeChange == "music":
            TEST.music = value
        elif typeChange == "show":
            TEST.show_result = value

        db.session.commit()
    
    print(f"Updated TEST {TEST.id}: music={TEST.music}, show_result={TEST.show_result}")

    return flask.jsonify({"status": "ok"})

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

