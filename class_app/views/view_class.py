import flask, string, random

from Project.render_page import render_page
from user_app.models import Classes, User, Task
from flask_login import current_user
from Project.database import db

from datetime import date

def generate_code(length):
    code= ""
    characters = string.ascii_letters + string.digits
    for letter in range(length):
        code += random.choice(characters)
    return code

def class_sorte():
    data = flask.request.get_json()
    sorteType= data.get('sortyType')

    my_classes= []
    my_classes_list= Classes.query.filter_by(teacher_id= current_user.id).all()
    
    if sorteType == "my_classes":
        tasks_class_teacher_list= []

        for clas in my_classes_list:
            tasks_list= []

            for index, task in  enumerate(clas.tasks):
                if index < 2:
                    tasks_list.append(task.dict())
            
            tasks_class_teacher_list.append(tasks_list)

        for clas in my_classes_list:
            my_classes.append(clas.dict())
        
        return flask.jsonify({
            "classes": my_classes,
            "tasks_class_teacher_list": tasks_class_teacher_list
        })
    
    elif sorteType == "classes":
        classes_id= []
        classes_list= []
        tasks_class_user_list= []

        user= User.query.filter_by(id= current_user.id).first()

        for clas in user.classes:
            classes_id.append(clas.id)

            tasks_list= []

            for index, task in  enumerate(clas.tasks):
                if index < 3:
                    tasks_list.append(task.dict())
            
            tasks_class_user_list.append(tasks_list)
        for id in classes_id:
            find_class= Classes.query.filter_by(id= id).first()
            classes_list.append(find_class.dict())

        return flask.jsonify({
            "classes_list": classes_list,
            "tasks_class_user_list": tasks_class_user_list
        })
    else:
        return flask.jsonify({"error": "error"})


@render_page(template_name = 'class_page.html')
def render_class_page():
    if flask.request.method == "POST":   
        try:
            title = flask.request.form['title']
            lesson = flask.request.form['lesson']
            color_type = flask.request.form['color-type']
            color_g1= ""
            color_g2= ""
            
            if color_type == "gradient":
                color_g1 = flask.request.form['color-g1']
                color_g2 = flask.request.form['color-g2']
            else: 
                color_g1 = flask.request.form['color-m']
                color_g2= None
            
            max_count= flask.request.form['max-count']
            
            while True: 
                code = generate_code(7)
                db_class_code = Classes.query.filter_by(class_code= code).first()
                
                if db_class_code is None:
                    break
            
            CLASS = Classes(
                title= title,
                lesson= lesson,
                class_code = code,
                teacher_id = current_user.id,
                created_date= date.today(),
                class_color1= color_g1,
                class_color2= color_g2,
                max_user_count= max_count
            )

            db.session.add(CLASS)
            db.session.commit()

            return flask.redirect(location = '/class_page')

        except Exception as error:
            if flask.request.method == 'POST':
                code = flask.request.form.get('code')
                CLASS = Classes.query.filter_by(class_code = code).first()

                if CLASS and current_user not in CLASS.users and current_user.id is not CLASS.teacher_id and len(CLASS.users) < CLASS.max_user_count:
                    CLASS.users.append(current_user)
                    db.session.commit()

                return flask.redirect(location = '/class_page')
    
    my_classes_list= []
    tasks_class_user_list = []
    tasks_class_teacher_list = []
    classes_list= []
    classes_id= []

    user= User.query.filter_by(id= current_user.id).first()
    my_classes_list= Classes.query.filter_by(teacher_id= current_user.id).all()

    for clas in user.classes:
        classes_id.append(clas.id)

        tasks_list= []

        for index, task in  enumerate(clas.tasks):
            if index < 3:
                tasks_list.append(task)
        
        tasks_class_user_list.append(tasks_list)

    for id in classes_id:
        classes_list.append(Classes.query.filter_by(id= id).first())

    for clas in my_classes_list:
        tasks_list= []

        for index, task in  enumerate(clas.tasks):
            if index < 2:
                tasks_list.append(task)
        
        tasks_class_teacher_list.append(tasks_list)
        
    return {"classes_list": classes_list,
            "my_classes_list": my_classes_list,
            "tasks_class_user_list": tasks_class_user_list,
            "tasks_class_teacher_list": tasks_class_teacher_list}

def delete_class(class_id):
    CLASS = Classes.query.filter_by(id = class_id).first()
    if current_user.id ==  CLASS.teacher_id:
        db.session.delete(CLASS)
        db.session.commit()

    return flask.redirect("/class_page")

def delete_task(task_id):
    TAKS = Task.query.filter_by(id = task_id).first()
    CLASS = Classes.query.filter_by(id = TAKS.class_id).first()
    if current_user.id ==  CLASS.teacher_id:
        db.session.delete(TAKS)
        db.session.commit()

    return flask.redirect(f"/class_courses{CLASS.id}")

def delete_user():
    class_id= flask.request.args.get("class_id")
    user_id= flask.request.args.get("user_id")

    CLASS = Classes.query.filter_by(id = class_id).first()
    USER = User.query.filter_by(id = user_id).first()

    if USER in CLASS.users and current_user.id == CLASS.teacher_id:
        CLASS.users.remove(USER)
        db.session.commit()

    return flask.redirect(f"/class_information{CLASS.id}")

