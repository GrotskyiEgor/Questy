import flask

from user_app.models import Score
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name = 'review_results.html')
def render_review_results(id):
    list_answers = []
    user_answers_list = []
    count_correct_answers = 0

    back_to_class = flask.request.args.get("back_to_class")
    back_to_task_result = flask.request.args.get("back_to_task_result")
    SCORE = Score.query.filter_by(id = id).first()
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
        if quiz.question_type == "multiple_choice":    
            if sorted(quiz.correct_answer.split("%$№")) == sorted(user_answers_list[number]):
                count_correct_answers += 1

    tokens= count_correct_answers * 500
    # print(back_to_task_result)
    return {
        "test": TEST,
        "score": SCORE,
        "tokens": tokens,
        "list_quiz": quizzes_list,
        "list_answers": list_answers,
        "user_answers": user_answers_list,
        "count_correct_answers": count_correct_answers,
        "back_to_class": back_to_class,
        "back_to_task_result": back_to_task_result
            }
