import flask

from Project.database import db
from user_app.models import User
from flask_login import current_user
from Project.render_page import render_page


@render_page(template_name='edit_avatar.html')
def render_edit_avatar(user_id):

    if current_user.id != int(user_id):
        return flask.redirect("/profile")

    user = User.query.filter_by(id=user_id).first()

    name_classes = ["skin-color", "haircut", "outwear", "pants", "boots"]

    if flask.request.method == "POST" and flask.request.form.get("ajax"):

        field = flask.request.form.get("field")
        value = flask.request.form.get("value")

        avatar_list = user.avatar.split("|")

        if field in name_classes:
            index = name_classes.index(field)
            avatar_list[index] = value

            user.avatar = "|".join(avatar_list)
            db.session.commit()

        return 200  
    
    list_clothes = list(map(int, user.avatar.split("|")))

    return {
        "list_clothes": list_clothes,
        "name_classes": name_classes
    }