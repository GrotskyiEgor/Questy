import flask
import random
import datetime
import os

from flask_login import current_user

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name = 'new_quiz.html')
def render_new_quiz():
    dataChoice = {
        "topic": "Основи Python",
        "description": "Тест на базові знання Python для початківців.",
        "questions": [
            {   
                "question_type": "choice",
                "question_text": "Яка правильна команда для виводу тексту на екран у Python?",
                "options": [
                    "echo('Hello World')",
                    "console.log('Hello World')",
                    "printf('Hello World')",
                    "print('Hello World')"
                ],
                "correct_answer": "print('Hello World')",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Який тип даних використовується для зберігання цілих чисел у Python?",
                "options": [
                    "float",
                    "str",
                    "bool",
                    "int"
                ],
                "correct_answer": "int",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Як позначається початок коментаря в Python?",
                "options": [
                    "//",
                    "<!-- -->",
                    "/* */",
                    "#"
                ],
                "correct_answer": "#",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Який з наведених варіантів створює список у Python?",
                "options": [
                    "(1, 2, 3)",
                    "{1, 2, 3}",
                    "<1, 2, 3>",
                    "[1, 2, 3]"
                ],
                "correct_answer": "[1, 2, 3]",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Як можна отримати довжину списку у Python?",
                "options": [
                    "length(list)",
                    "count(list)",
                    "size(list)",
                    "len(list)"
                ],
                "correct_answer": "len(list)",
                "time": 60
            }
        ]
    }
    
    dataInput = {
        "topic": "Основи Python",
        "description": "Тест на базові знання Python для початківців.",
        "questions": [
            {
                "question_type": "choice",
                "question_text": "Яка правильна команда для виводу тексту на екран у Python?",
                "options": [
                    "echo('Hello World')",
                    "console.log('Hello World')",
                    "printf('Hello World')",
                    "print('Hello World')", 
                    "print('Hello World')2",
                    "print('Hello World')3"
                ],
                "correct_answer": "print('Hello World')",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Який тип даних використовується для зберігання цілих чисел у Python?",
                "options": [
                    "float",
                    "str",
                    "int"
                ],
                "correct_answer": "int",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Як позначається початок коментаря в Python?",
                "options": [
                    "//",
                    "<!-- -->",
                    "/* */"
                ],
                "correct_answer": "#",
                "time": 60
            },
            {
                "question_type": "input",
                "question_text": "Як можна отримати довжину списку у Python?",
                "options": [],
                "correct_answer": "len(list)",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Який з наведених варіантів створює список у Python?",
                "options": [
                    "(1, 2, 3)",
                    "{1, 2, 3}",
                    "<1, 2, 3>",
                    "[1, 2, 3]"
                ],
                "correct_answer": "[1, 2, 3]",
                "time": 60
            }
        ]
    }   

    dataImage = {
        "topic": "Основи Python",
        "description": "Тест на базові знання Python для початківців.",
        "questions": [
            {
                "question_type": "choice",
                "question_text": "Яка правильна команда для виводу тексту на екран у Python?",
                "options": [
                    "echo('Hello World')",
                    "console.log('Hello World')",
                    "printf('Hello World')",
                    "print('Hello World')", 
                    "print('Hello World')2",
                    "print('Hello World')3"
                ],
                "correct_answer": "print('Hello World')",
                "time": 60
            },
            {
                "question_type": "image",
                "question_text": "Який тип даних використовується для зберігання цілих чисел у Python?",
                "image_name": "quiz_image.png", 
                "options": [
                    "float",
                    "str",
                    "int"
                ],
                "correct_answer": "int",
                "time": 60
            },
            {
                "question_type": "multiple_choice",
                "question_text": "Як позначається початок коментаря в Python?",
                "options": [
                    "//",
                    "<!-- -->",
                    "/* */",
                    "!!!"
                ],
                "correct_answer": "/* */%$№//",
                "time": 60
            },
            {
                "question_type": "input",
                "question_text": "Як можна отримати довжину списку у Python?",
                "options": [],
                "correct_answer": "len(list)",
                "time": 60
            },
            {
                "question_type": "choice",
                "question_text": "Який з наведених варіантів створює список у Python?",
                "options": [
                    "(1, 2, 3)",
                    "{1, 2, 3}",
                    "<1, 2, 3>",
                    "[1, 2, 3]"
                ],
                "correct_answer": "[1, 2, 3]",
                "time": 60
            }
        ]
    }
    
    if flask.request.method == "POST":   
        try:
            title = flask.request.form['title']
            description = flask.request.form['description']
            total_questions = flask.request.form['total_questions'] 
            time= flask.request.form["time"]
            image_form = flask.request.files.get('image', None)

            total_questions = total_questions or 10
            time = time or 20
            
            test = Test(
                title = title,
                description = description,
                total_questions = total_questions,
                test_code = 0,
                author_name = current_user.username,
                image = 1 if image_form else 0,
                created_date = datetime.date.today()
            )

            db.session.add(test)
            db.session.commit()

            image_folder_path = os.path.abspath(os.path.join(__file__, "..", "..","..","test_app","static","images", f"{test.id}"))

            if test.image:
                image_form.save(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", "media", f"{test.id}")))

            for quizzes in dataImage["questions"]:
                answers_list = quizzes["options"].copy()
                image_name = quizzes.get("image_name")
                random.shuffle(answers_list)
                quiz = Quiz(
                    question_type=quizzes["question_type"],
                    question_text=quizzes["question_text"],
                    image_name=image_name if image_name else None,
                    answer_options="%$№".join(answers_list),
                    correct_answer=quizzes["correct_answer"],
                    time=quizzes["time"],
                    test_id=test.id             
                )
                db.session.add(quiz)

                if quiz.image_name:
                    os.makedirs(image_folder_path, exist_ok= True)
                    image_form.save(os.path.abspath(os.path.join(image_folder_path, f"{image_name}")))
                        
            db.session.commit()
                
            return flask.redirect(location = '/quizzes')

        except Exception as error:
            print(error)

    return { }