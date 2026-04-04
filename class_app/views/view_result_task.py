import flask, os, io

from Project.settings import csrf
from Project.render_page import render_page
from user_app.models import Classes, Score, Task
from test_app.models import Test
from test_app.views.charts_room import excel_table, room_get_result, clean_data

@csrf.exempt
@render_page(template_name='result_task.html')
def render_result_task():
    class_id = flask.request.args.get("class_id")
    task_id = flask.request.args.get("task_id")

    CLASS = Classes.query.filter_by(id=class_id).first()
    TASK = Task.query.filter_by(id=task_id).first()

    if not CLASS or not TASK:
        return flask.redirect("/")

    undo_user_list = []
    do_user_list = []
    do_score_list = []
    
    room_data = {}
    best_score = {}
    worst_score = {}
    hardest_question = {}
    average_accuracy = 0

    users_list = []
    date_complete = []
    accuracy = []

    average_accuracy_per_question = []
    scores_by_user = {}
    unique_dates = []
    accuracy = []

    for user in CLASS.users:
        score = Score.query.filter_by(test_id=TASK.test_id, class_id=CLASS.id, user_id=user.id, task_test_id=TASK.id).first()
        if score:
            do_user_list.append(user)
            do_score_list.append(score)
        else:
            undo_user_list.append(user)

    # Собираем все оценки по класу
    scores = Score.query.filter_by(class_id=CLASS.id, task_test_id=TASK.id).all()

    for score in scores:
        if score.user_name not in scores_by_user:
            scores_by_user[score.user_name] = []
        scores_by_user[score.user_name].append((score.date_complete, score.accuracy))

    # список пользователей
    users_list = list(scores_by_user.keys())

    for values in scores_by_user.values():
        for d, _ in values:
            if d not in unique_dates:
                unique_dates.append(d)

    # сортировка по дате
    date_complete = sorted(unique_dates)

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

    if scores:
        test_code = scores[0].test_code
        result = room_get_result(test_code, TEST.author_name)

        if result:
            room_data, best_score, worst_score, hardest_question, average_accuracy = result
        else:
            room_data, best_score, worst_score, hardest_question, average_accuracy = {}, {}, {}, {}, 0
    
        room_get_result_data = clean_data(room_data)

        for q_num in range(TEST.total_questions):
            question_scores = []
            for user, data in room_data.items():
                if len(data['correct_answers_list']) > q_num:
                    question_scores.append(data['correct_answers_list'][q_num])
            avg = int(sum(question_scores) / len(question_scores) * 100) if question_scores else 0
            average_accuracy_per_question.append(avg)

    # ---------------- Генерация Excel при POST ----------------
    if flask.request.method == "POST" and room_data:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, f"results{test_code}.xlsx")

        excel_table(
            username="teacher",
            author_name=TEST.author_name,
            result_data=room_get_result_data,
            best_score_data=best_score,
            worst_score_data=worst_score,
            hardest_question_data=hardest_question,
            test_code=test_code
        )

        return_data = io.BytesIO()
        with open(file_path, 'rb') as f:
            return_data.write(f.read())
        return_data.seek(0)

        os.remove(file_path)

        return flask.send_file(
            return_data,
            as_attachment=True,
            download_name="results.xlsx",
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

    return {
        "do_user_list": do_user_list,
        "users": users_list,
        "accuracy": accuracy,
        "total_questions": total_questions,
        "average_accuracy": average_accuracy_per_question,
        "date_complete": date_complete,
        "do_score_list": do_score_list,
        "undo_user_list": undo_user_list,
        "task": TASK,
        "class": CLASS,
        "result_data": room_get_result_data,
        "best_score": best_score,
        "worst_score": worst_score,
        "hardest_question": hardest_question
    }