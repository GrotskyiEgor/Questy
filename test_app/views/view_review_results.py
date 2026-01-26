import flask

from user_app.models import Score
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name = 'review_results.html')
def render_review_results(id):
    list_answers = []
    user_answers_list = []
    count_correct_answers = 0

    bask_to_class= flask.request.args.get("bask_to_class")
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
            user_answers_list[index]=  user_answers_list[index].split("$$$")
    
    for number, quiz in enumerate(quizzes_list):
        if quiz.correct_answer == user_answers_list[number]:
            count_correct_answers += 1

    tokens= count_correct_answers * 500
    return {
        "test": TEST,
        "accuracy": SCORE.accuracy,
        "tokens": tokens,
        "list_quiz": quizzes_list,
        "list_answers": list_answers,
        "user_answers": user_answers_list,
        "count_correct_answers": count_correct_answers,
        "bask_to_class": bask_to_class
            }