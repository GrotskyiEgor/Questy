import flask

from flask_login import current_user

from ..models import Test, Quiz
from Project.database import db
from Project.render_page import render_page


@render_page(template_name = 'edit_test.html')
def render_test_app():
    
    list_quiz = []
    list_answers = []
    list_answers_multiple_choice = []

    test_id = flask.request.args.get('test_id')
    test = Test.query.filter_by(id= test_id).first()

    for quiz in Quiz.query.filter_by(test_id= test_id).all():
        if quiz.question_type == "multiple_choice":
            list_answers_multiple_choice.extend(quiz.correct_answer.split("%$№"))

        if quiz.question_type == "input":
            list_answers.append([quiz.correct_answer])
            
        list_answers.append(quiz.answer_options.split("%$№"))
        list_quiz.append(quiz)
        
    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers,
        "list_answers_multiple_choice": list_answers_multiple_choice
    }

def delete_quiz_question(quiz_id):
    quiz = Quiz.query.filter_by(id = quiz_id).first()
    test = Test.query.filter_by(id = quiz.test_id).first()

    if test.author_name == current_user.username:
        test.total_questions -= 1 
        db.session.delete(quiz)
        db.session.commit()
    
    return flask.redirect(location= f'/test_app?test_id={test.id}')