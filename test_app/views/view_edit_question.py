import flask

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name="edit_question.html")
def render_edit_question():
    quiz_id = flask.request.args.get("quiz_id")
    test_id = flask.request.args.get("test_id")

    quiz = Quiz.query.filter_by(id= quiz_id).first()
    test = Test.query.filter_by(id= test_id).first()


    list_answers = quiz.answer_options.split("%$№") if quiz.answer_options else []
    correct_answer = quiz.correct_answer
    question_text = quiz.question_text
    message = ""
    
    if quiz.question_type == "multiple_choice":
        correct_answer = correct_answer.split("%$№")


    if flask.request.method == "POST":
        updated_answers = []

        # random.shuffle(updated_answers)
        if quiz.question_type == "choice":
            for count_answers in range(len(list_answers)):
                field_name = f"answer{count_answers}"
                new_value = flask.request.form.get(field_name, "").strip()
                if new_value:
                    updated_answers.append(new_value)
                    # print("новый ответ", new_value)
                else:
                    new_correct = flask.request.form.get("correct_answer", "").strip()
                    updated_answers.append(new_correct)
                    quiz.correct_answer = new_correct
                    # print("новый правильный ответ", new_correct)

            quiz.answer_options = "%$№".join(updated_answers)
            db.session.commit()

        if quiz.question_type == "input":
            new_correct = flask.request.form.get("correct_answer", "").strip()
            quiz.correct_answer = new_correct
            db.session.commit()
            # print("новый правильный ответ", new_correct)

        if quiz.question_type == "multiple_choice":
            new_correct_list = []
            for count_answers in range(len(list_answers)):
                field_name = f"answer{count_answers}"
                new_value = flask.request.form.get(field_name, "").strip()
                if new_value:
                    updated_answers.append(new_value)
                    # print("новый ответ", new_value)
                else:
                    new_correct = flask.request.form.get(f"correct_answer{count_answers}", "").strip()
                    updated_answers.append(new_correct)
                    new_correct_list.append(new_correct)
                    # print("новый правильный ответ", new_correct)

            quiz.answer_options = "%$№".join(updated_answers)
            quiz.correct_answer = "%$№".join(new_correct_list)
            db.session.commit()
        
        if quiz.question_type == "image":
            for count_answers in range(len(list_answers)):
                field_name = f"answer{count_answers}"
                new_value = flask.request.form.get(field_name, "").strip()
                if new_value:
                    updated_answers.append(new_value)
                    print("новый ответ", new_value)
                else:
                    new_correct = flask.request.form.get("correct_answer", "").strip()
                    updated_answers.append(new_correct)
                    quiz.correct_answer = new_correct
                    print("новый правильный ответ", new_correct)

            quiz.answer_options = "%$№".join(updated_answers)
            db.session.commit()
            

        print(f"Вопроссы: {quiz.answer_options}")
        return flask.redirect(f"/test_app?test_id={test.id}")

    return {
        "test": test,
        "quiz": quiz,
        "quiz_id": quiz.id,
        "list_answers": list_answers,
        "count_answers": len(list_answers),
        "correct_answer": correct_answer,
        "question_text": question_text,
        "message": message,
    }