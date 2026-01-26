import flask
import random
from datetime import datetime
from flask_login import current_user

from Project.database import db
from user_app.models import Task
from test_app.models import Test, Room
from Project.render_page import render_page


@render_page(template_name='create_task.html')
def render_create_task(id):

    test_list = Test.query.filter_by(author_name=current_user.username).all()
    back_course = flask.request.args.get("back_course")

    # filter_test_list = []
    # for test in test_list:
    #     task_in_class = Task.query.filter_by(test_id=test.id, class_id=id).first()
    #     if not task_in_class:
    #         filter_test_list.append(test)

    # test_list = filter_test_list

    if flask.request.method == "POST":   
        try:
            title = flask.request.form['title']
            description = flask.request.form['description']
            test_id = flask.request.form['choice_test']
            due_time = flask.request.form['due-time']
            done_after_due_time = flask.request.form.get('done-after-due-time')
            online_test = flask.request.form.get('online-test')

            print(online_test)
            
            TASK = Task(
                title=title,
                description=description,
                class_id=id,
                test_id=test_id,
                due_time=datetime.strptime(due_time, "%Y-%m-%dT%H:%M") if due_time else None,
                work_after_time=True if done_after_due_time == "on" else False,
                online=True if online_test == "on" else False
            )

            db.session.add(TASK)
            db.session.commit()

            if TASK.online == "on":
                while True:
                    code = random.randint(1000, 9999)
                    room_code = Room.query.filter_by(test_code= code).first()
                    if room_code == None:
                        break
                    
                TASK.test_code= code
                db.session.commit()

            if back_course:
                return flask.redirect(location=f'/class_courses{back_course}')
            
            return flask.redirect(location='/class_page')

        except Exception as error:
            print(error)

    return {"test_list": test_list}
