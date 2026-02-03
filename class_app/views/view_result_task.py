import flask

from Project.render_page import render_page
from user_app.models import Classes, Score, Task
from test_app.models import Test

@render_page(template_name='result_task.html')
def render_result_task():
    undo_user_list = []
    do_user_list = []
    do_score_list = []

    users_list = []
    date_complete = []
    accuracy = []

    class_id = flask.request.args.get("class_id")
    task_id = flask.request.args.get("task_id")

    CLASS = Classes.query.filter_by(id=class_id).first()
    TASK = Task.query.filter_by(id=task_id).first()

    # Разделение на сделавших и не сделавших
    for user in CLASS.users:
        score = Score.query.filter_by(test_id=TASK.test_id, class_id=CLASS.id, user_id=user.id).first()
        if score:
            do_user_list.append(user)
            do_score_list.append(score)
        else:
            undo_user_list.append(user)

    # Собираем все оценки по классу
    scores = Score.query.filter_by(class_id=CLASS.id).all()

    # Словарь: user_name -> список (date_complete, accuracy)
    scores_by_user = {}
    for score in scores:
        if score.user_name not in scores_by_user:
            scores_by_user[score.user_name] = []
        scores_by_user[score.user_name].append((score.date_complete, score.accuracy))

    # список пользователей
    users_list = list(scores_by_user.keys())

    # общий список всех дат (без повторов)
    unique_dates = []
    for values in scores_by_user.values():
        for d, _ in values:
            if d not in unique_dates:
                unique_dates.append(d)
    # сортировка по дате
    date_complete = sorted(unique_dates)

    # accuracy = список списков (по каждому пользователю)
    accuracy = []
    for user in users_list:
        user_acc = []
        for d in date_complete:
            found = None
            for dd, acc in scores_by_user[user]:
                if dd == d:
                    found = acc
                    break
            user_acc.append(found if found is not None else None)
        accuracy.append(user_acc)

    TEST = Test.query.filter_by(id=TASK.test_id).first()
    total_questions = list(range(1, TEST.total_questions + 1))

    # средняя точность (для первого графика)
    all_acc_values = [s.accuracy for s in scores]
    average_accuracy = int(sum(all_acc_values) / len(all_acc_values)) if all_acc_values else 0
    
    return {
        "do_user_list": do_user_list,
        "users": users_list,
        "accuracy": accuracy,
        "total_questions": total_questions,
        "average_accuracy": [average_accuracy],
        "date_complete": date_complete,
        "do_score_list": do_score_list,
        "undo_user_list": undo_user_list,
        "class": CLASS
    }