import flask
import io
import datetime
from flask_login import current_user

from Project.settings import csrf
from Project.render_page import render_page
from user_app.models import Score, User
from test_app.models import Test


@csrf.exempt
def profile_sorte():
    data = flask.request.get_json(silent=True)

    if not data:
        return flask.jsonify({"error": "Bad json"}), 400
    
    sorte_type = data.get('sortyType')

    if sorte_type == "accuracy":
        scores = Score.query.filter_by(user_id=current_user.id).order_by(Score.accuracy.desc()).all()
    elif sorte_type == "date":
        scores = Score.query.filter_by(user_id=current_user.id).order_by(Score.date_complete.desc()).all()
    else: 
        return flask.json({"scores": [], "tests": []}), 400
    
    result = []
    test_sort_list = []

    for score in scores:
        if score.test_id is None:
            continue

        test = Test.query.get(score.test_id)

        if test:
            test_sort_list.append(test.dict())
            result.append(score.dict())

    return flask.jsonify({
        "scores": result,
        "tests": test_sort_list})

@render_page(template_name='profile.html')
def render_profile():
    accuracy = []
    time_complete = []
    date_complete = []
    dates_complete = []
    count_cmpl_quiz = []
    scores = None
    list_tests = []
    list_tests_sort = []
    selected_option = ["accuracy_by_date"]
    tests_count = 0
    scores_count = 0
    user = None
    message = ''
    show_graph= True

    buffer = io.BytesIO()
    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.id).first()
        
        scores = Score.query.filter_by(user_id=current_user.id).all()
        tests_count = len(Test.query.filter_by(author_name= current_user.username).all())
        scores_count = len(scores)

        for score in scores:
            accuracy.append(score.accuracy)
            date_complete.append(score.date_complete)
            time_complete.append(score.time_complete)
            dates_complete.append(score.date_complete)

            test = Test.query.filter_by(id=score.test_id).first()
            if test and test not in list_tests:
                list_tests.append(test)

        if flask.request.method == 'POST':
            if flask.request.form.get('choice') != None:
                selected_option[0] = (flask.request.form.get('choice'))
    
        unique_dates_complete = sorted(set(dates_complete))

        if selected_option[0] == 'accuracy_by_date':

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                "dates_complete": dates_complete,
                'accuracy': accuracy or [],
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                'select_chart': '1',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "show_graph": show_graph
            }

        elif selected_option[0] == 'activity_by_hour':            
            hours_count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

            for score in scores:
                time_complete_str = score.time_complete

                try:
                    time_completed = datetime.datetime.strptime(time_complete_str, '%H:%M:%S')
                    hour = time_completed.hour
                    hours_count[hour] += 1
                except ValueError:
                    continue

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                "dates_complete": dates_complete,
                'accuracy': accuracy or [],
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                'select_chart': '1_active',
                'count_cmpl_quiz': hours_count or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "show_graph": show_graph
            }
   
        elif selected_option[0] == 'completed_test':  
            for date in dates_complete:
                count = Score.query.filter_by(user_id=current_user.id, date_complete=date).count()
                count_cmpl_quiz.append(count)

            return {
                "scores": scores,
                'list_tests': list_tests,
                'dates_complete': unique_dates_complete,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'select_chart': 'd_cmpl',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'accuracy': accuracy or [],
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                "selected_option": selected_option,
                'user': user,
                "list_tests_sort": list_tests_sort,
                "show_graph": show_graph
            }

        elif selected_option[0] == 'accuracy_week':
            show_graph = True
            message = ''
            
            if not dates_complete: 
                show_graph = False
                message = 'Немає даних для побудови графіка'
            else:
                first_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
                last_date = datetime.datetime.strptime(dates_complete[-1], '%Y-%m-%d')
                if (last_date - first_date).days < 7:
                    show_graph = False
                    message = 'Занадто мало даних для побудови графіка'

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'message': message,
                'dates_complete': dates_complete,
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "show_graph": show_graph
            }

            
        elif selected_option[0] == 'accuracy_month':
            show_graph = True
            message = ''
            
            if not dates_complete: 
                show_graph = False
                message = 'Немає даних для побудови графіка'
            else:
                first_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
                last_date = datetime.datetime.strptime(dates_complete[-1], '%Y-%m-%d')     

                if (last_date - first_date).days < 30:
                    show_graph = False
                    message = 'Занадто мало даних для побудови графіка'

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'message': message,
                'dates_complete': dates_complete,
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                "selected_option": selected_option,
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort,
                "show_graph": show_graph
            }
    else:
        message = "Ви не авторизовані"

    selected_option = ['accuracy_by_date']

    return {
        "scores": scores,
        "scores_count": scores_count,
        "tests_count": tests_count,
        'message': message,
        'list_tests': list_tests,
        'count_cmpl_quiz': count_cmpl_quiz or [],
        'accuracy': accuracy or [],
        'user': user,
        'list_tests': list_tests,
        'date_complete': date_complete or [],
        'time_complete': time_complete or [],
        "selected_option": selected_option,
        "list_tests_sort": list_tests_sort
        }