import flask, os, io

from Project.settings import csrf
from Project.render_page import render_page
from user_app.models import Classes, Score, Task
from test_app.models import Test
from test_app.views.charts_room import excel_table, room_get_result, clean_data


@csrf.exempt
@render_page(template_name='class_result.html')
def render_class_results():
    class_id = flask.request.args.get("class_id")
    CLASS = Classes.query.filter_by(id=class_id).first()

    if not CLASS:
        return flask.redirect("/")

    user_list = list(CLASS.users)
    tasks = Task.query.filter_by(class_id=CLASS.id).all()

    task_titles = []
    avg_accuracy_per_task = []
    room_get_result_data = {}
    user_accuracy = []
    timeline_labels = []
    timeline_accuracy = []

    for task in tasks:
        task_titles.append(task.title)
        scores = Score.query.filter_by(task_test_id=task.id, class_id=CLASS.id).all()
        avg_acc = int(sum(score.accuracy for score in scores) / len(scores)) if scores else 0
        avg_accuracy_per_task.append(avg_acc)

        if scores:
            test_code = scores[0].test_code
            TEST = task.test
            room_result = room_get_result(test_code, TEST.author_name)
            if room_result:
                room_data, best_score, worst_score, hardest_question, average_accuracy = room_result
                room_data = clean_data(room_data)
                room_get_result_data.update(room_data)

    for user in user_list:
        username = user.username
        data = room_get_result_data.get(username)
        if data:
            correct_list = data.get("correct_answers_list", [])
            acc = sum(1 for c in correct_list if c == 1) / len(correct_list) * 100 if correct_list else 0
        else:
            acc = 0
        user_accuracy.append(acc)

    if tasks and room_get_result_data:
        first_task = tasks[0]
        TEST = first_task.test
        timeline_labels = list(range(1, TEST.total_questions + 1))
        for i in range(TEST.total_questions):
            total = sum(1 for u_data in room_get_result_data.values()
                        if len(u_data.get("correct_answers_list", [])) > i
                        and u_data["correct_answers_list"][i] == 1)
            timeline_accuracy.append(total / len(user_list) * 100 if user_list else 0)

    return {
        "class": CLASS,
        "user_list": user_list,
        "tasks": task_titles,
        "avg_accuracy_per_task": avg_accuracy_per_task,
        "room_get_result_data": room_get_result_data,
        "user_accuracy": user_accuracy,
        "timeline_labels": timeline_labels,
        "timeline_accuracy": timeline_accuracy
    }