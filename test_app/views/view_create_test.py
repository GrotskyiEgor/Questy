import flask
import random
import datetime
import os
import json
import traceback

from flask_login import current_user

from Project.settings import csrf
from Project.database import db
from ..models import Test, Quiz
from Project.render_page import render_page


@render_page(template_name='create_test.html')
def render_create_test():
    return {}

@csrf.exempt
def create_test():
    try:
        data = json.loads(flask.request.form.get('data'))
        images = flask.request.files
        print("AUTH:", current_user.is_authenticated)

        title = data.get("topic")
        description = data.get("description") 
        time= data.get('time')
        test_image_file = flask.request.files.get("test-image")

        total_questions = len(data["questions"])
        time = time or 20
        
        test = Test(
            title = title,
            description = description,
            total_questions = total_questions,
            test_code = 0,
            author_name = current_user.username,
            image = test_image_file.filename if test_image_file else None,
            created_date = datetime.date.today()
        )

        db.session.add(test)
        db.session.commit()

        IMAGES_DIR = os.path.abspath(os.path.join(__file__, "..", "..","..","test_app","static","images", f"{test.id}"))
        os.makedirs(IMAGES_DIR, exist_ok=True)

        if test_image_file:
            test_image_file.save(os.path.join(os.path.abspath(os.path.join(__file__, "..", "..","..","home_app","static","images", f"{test.id}.png"))))

        for index, quizzes in enumerate(data["questions"]):
            file_key = f"question-image-{index}"
            quiz_image_file = images.get(file_key)
            quiz_image_filename = None
            
            if quiz_image_file:
                quiz_image_filename = quiz_image_file.filename
                quiz_image_file.save(os.path.abspath(os.path.join(IMAGES_DIR, f"{quiz_image_filename}")))

            answers_list = quizzes["options"].copy()
            random.shuffle(answers_list)

            quiz = Quiz(
                question_type=quizzes["question_type"],
                question_text=quizzes["question_text"],
                image_name=quiz_image_filename,
                answer_options="%$№".join(answers_list),
                correct_answer=quizzes["correct_answer"],
                time=quizzes["time"],
                test_id=test.id             
            )
            db.session.add(quiz)
                       
        db.session.commit()

    except Exception as error:
        traceback.print_exc()
        return {"error": str(error)}, 400

    return {}

