import flask

from user_app.models import Score
from ..models import Test, Quiz
from Project.render_page import render_page
from .charts_room import room_get_result


@render_page(template_name = 'review_results.html')
def render_review_results(id):
    list_answers = []
    user_answers_list = []
    count_correct_answers = 0
    correct_answers_list = []
    result_data = {}

    back_to_class = flask.request.args.get("back_to_class")
    back_to_task_result = flask.request.args.get("back_to_task_result")
    SCORE = Score.query.filter_by(id = id).first()

    if not SCORE: 
        return flask.redirect("/")
    
    user_timers = getattr(SCORE, "user_timers", []) or []
    user_tokens = getattr(SCORE, "user_tokens", []) or []
    
    TEST = Test.query.filter_by(id= SCORE.test_id).first()
    quizzes_list= Quiz.query.filter_by(test_id= SCORE.test_id).all()
    
    for quiz in quizzes_list:
        if quiz.question_type == "input":
            list_answers.append(quiz.correct_answer)
        else :
            list_answers.append(quiz.answer_options.split("%$№"))

    user_answers_db = SCORE.user_answer
    user_answers = user_answers_db.split("|")

    for answer in user_answers:
        if answer != "":
            user_answers_list.append(answer)
    for index, quiz in enumerate(quizzes_list):
        if quiz.question_type == "multiple_choice":
            user_answers_list[index] = user_answers_list[index].split("$$$")
    
    for number, quiz in enumerate(quizzes_list):     
        if (quiz.question_type == "choice" or quiz.question_type == "input" or quiz.question_type == "image") and quiz.correct_answer == user_answers_list[number]:
            count_correct_answers += 1
            correct_answers_list.append(1)
        elif quiz.question_type == "multiple_choice":    
            if sorted(quiz.correct_answer.split("%$№")) == sorted(user_answers_list[number]):
                count_correct_answers += 1
                correct_answers_list.append(1)
            else:
                correct_answers_list.append(0)
        else:
            correct_answers_list.append(0)

    tokens = count_correct_answers * 500

    show_graphs = bool(getattr(SCORE, 'user_timers', None) or getattr(SCORE, 'user_tokens', None))
    print("==============")
    print("SCORE", SCORE)
    print("show_graphs", show_graphs)
    print("user_timer", user_timers)
    print("user_tokens", user_tokens)

    if show_graphs:
        result_data = {
            SCORE.user_name: {
                "correct_answers_list": correct_answers_list,
                "timers_list": [int(score) for score in SCORE.user_timers.split("|")],
                "token_list": [int(score) for score in SCORE.user_tokens.split("|")]
            }
        }

    print(result_data)

    return {
        "test": TEST,
        "score": SCORE,
        "tokens": tokens,
        "list_quiz": quizzes_list,
        "list_answers": list_answers,
        "user_answers": user_answers_list,
        "count_correct_answers": count_correct_answers,
        "back_to_class": back_to_class,
        "back_to_task_result": back_to_task_result,
        "show_graphs": show_graphs,
        "user_timers": user_timers,
        "user_tokens": user_tokens,
        "result_data": result_data
    }
