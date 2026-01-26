import flask
import io
import datetime
from flask_login import current_user

from Project.render_page import render_page
from user_app.models import Score, User
from test_app.models import Test


def bubble_sort(list):
    list_length = len(list)
    for length in range(list_length):
        for accuracy in range(0, list_length - length - 1):
            if list[accuracy][0] <= list[accuracy+ 1][0] :
                list[accuracy], list[accuracy+ 1] = list[accuracy+ 1], list[accuracy]
    return list


def profile_sorte():
    data = flask.request.get_json()
    sorte_type = data.get('sortyType')
    scores = Score.query.filter_by(user_id=current_user.id).all()

    date_sort = []
    accuracy_sort = []
    list_tests_sort = []

    for score in scores:
        test= Test.query.filter_by(id=score.test_id).first()
        if test and test not in list_tests_sort:
            list_tests_sort.append(test.dict())

    if sorte_type == "accuracy":
        for score in scores:
            accuracy_sort.append([score.accuracy, score.id, score.test_id, score.date_complete, score.time_complete])

        bubble_sort(list = accuracy_sort)

        return flask.jsonify({
            "scores": accuracy_sort,
            "tests": list_tests_sort})
    elif sorte_type == "date":
        for score in scores:
            date_sort.append(score.dict())
        
        return flask.jsonify({
            "scores": date_sort,
            "tests": list_tests_sort})
    else:
        return flask.jsonify({
            "scores": [],
            "tests": []})

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
    selected_option = ["graph_1"]
    message = ' '
    tests_count = 0
    scores_count = 0
    user = None

    buffer = io.BytesIO()
    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.id).first()
        
        scores = Score.query.filter_by(user_id=current_user.id).all()
        tests_count = len(Test.query.filter_by(author_name= current_user.username).all())
        scores_count = len(scores)

        print(tests_count, scores_count)
        for score in scores:
            accuracy.append(score.accuracy)
            date_complete.append(score.date_complete)
            time_complete.append(score.time_complete)
            dates_complete.append(score.date_complete)
            if Test.query.filter_by(id= score.test_id).first() not in list_tests:
                list_tests.append(Test.query.filter_by(id= score.test_id).first())

        if flask.request.method == 'POST':
            if flask.request.form.get('choice') != None:
                selected_option[0] = (flask.request.form.get('choice'))
    
        dates_complete.sort()

        print(selected_option)
        if selected_option[0] == 'graph_active1':
                
                count_cmpl_quiz.extend([2,3,4,5,6,7,3,24,5])
                time_complete.append('11:11:11')
                time_complete.append('13:11:11') # ДЛЯ НАГЛЯДНОСТИ !
                time_complete.append('14:11:11')
                print(f'----------------{time_complete}')
                print(f'++++++++++++++++{count_cmpl_quiz}')

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
                'wt_graph': '1_active',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort
            }

        if selected_option[0] == 'graph_1':
            dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']
            accuracy = [13, 25, 66]

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
                'wt_graph': '1',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort
            }
        
        
        
        elif selected_option[0] == 'graph_active2':  
            for date in dates_complete:
                count = Score.query.filter_by(user_id=current_user.id, date_complete=date).count()
                count_cmpl_quiz.append(count)
                
            count_cmpl_quiz.extend([2,3,4,5,6,7,3,24,5])
            dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']

            print(count_cmpl_quiz)
            print(dates_complete)

            return {
                "scores": scores,
                'list_tests': list_tests,
                'dates_complete': dates_complete,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'wt_graph': 'd_cmpl',
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'accuracy': accuracy or [],
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                "selected_option": selected_option,
                'user': user,
                "list_tests_sort": list_tests_sort
            }

        elif selected_option[0] == 'graph_active3':
            
            if dates_complete: 
                obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
                delta_week = obj_date + datetime.timedelta(days=7)
                if delta_week <= obj_date:
                    dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22'] # ДЛЯ НАГЛЯДНОСТИ!
                    accuracy = [13, 25, 60]
                else:
                    message = 'Занадто мало даних для побудови графіка'
            else:
                message = 'Немає даних для побудови графіка'


            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'message': message,
                'flag_graph': 'flag_graph',
                'dates_complete': dates_complete,
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                "selected_option": selected_option,
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort
            }

            
        elif selected_option[0] == 'graph_active4':
            
            if dates_complete: 
                obj_date = datetime.datetime.strptime(dates_complete[0], '%Y-%m-%d')
                delta_month = obj_date + datetime.timedelta(days=31)

                if delta_month <= obj_date:
                    dates_complete = ['2025-07-20', '2025-07-21', '2025-07-22']
                    accuracy = [13, 25, 60]
                    message = 'Занадто мало даних для побудови графіка'
            else:

                message = 'Немає даних для побудови графіка'

            return {
                "scores": scores,
                "scores_count": scores_count,
                "tests_count": tests_count,
                'message': message,
                'flag_graph': 'flag_graph',
                'dates_complete': dates_complete,
                'accuracy': accuracy or [],
                'list_tests': list_tests,
                'date_complete': date_complete or [],
                'time_complete': time_complete or [],
                "selected_option": selected_option,
                'count_cmpl_quiz': count_cmpl_quiz or [],
                'user': user,
                "list_tests_sort": list_tests_sort
            }
    else:
        message = "Ви не авторизовані"

    selected_option = ['0']

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
        "scores": scores,
        'date_complete': date_complete or [],
        'time_complete': time_complete or [],
        "selected_option": selected_option,
        "list_tests_sort": list_tests_sort
        }