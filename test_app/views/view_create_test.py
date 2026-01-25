import flask
import random
import datetime
import os
import json

from flask_login import current_user

from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name='create_test.html')
def render_create_test():
    return {}


def create_test():
    try:
        data = json.loads(flask.request.form.get('data'))
        images = flask.request.files

        title = data.get("topic")
        description = data.get("description")
        total_questions = data.get('total_questions')
        # answers_per_question = data.get('answers_per_question')
        time= data.get('time')
        image_form = data.get("image")

        total_questions = total_questions or len(data["questions"])
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

        IMAGES_DIR = os.path.abspath(os.path.join(__file__, "..", "..","..","test_app","static","images", f"{test.id}"))
        os.makedirs(IMAGES_DIR, exist_ok= True)

        for quizzes in data["questions"]:
            image_name= quizzes.get('image_name')

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

            if image_name and image_name in images:
                image= flask.request.files[image_name]
                image.save(os.path.abspath(os.path.join(IMAGES_DIR, f"{image_name}")))
                       
        db.session.commit()

    except Exception as error:
        print(error)

    return {}

