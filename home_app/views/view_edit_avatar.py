import os
import flask
from flask import current_app
from Project.database import db
from user_app.models import User
from flask_login import current_user
from Project.render_page import render_page

@render_page(template_name='edit_avatar.html')
def render_edit_avatar(user_id):
    if current_user.id != int(user_id):
        return flask.redirect("/profile")

    user = User.query.filter_by(id=user_id).first()

    name_classes = ["Avatar", "Something", "Something", "Something", "Something"]

    if flask.request.method == "POST" and flask.request.form.get("ajax"):
        field = flask.request.form.get("field")
        value = flask.request.form.get("value")

        avatar_list = user.avatar.split("|")

        if field in name_classes:
            index = name_classes.index(field)
            avatar_list[index] = str(value)

            user.avatar = "|".join(avatar_list)
            db.session.commit()

        return flask.make_response("Success", 200)

    list_clothes = list(map(int, user.avatar.split("|")))

    all_options = {}
    static_media_path = os.path.join(current_app.static_folder, 'media')

    for category in name_classes:
        category_path = os.path.join(static_media_path, category)
        
        if os.path.exists(category_path):
            files = [f for f in os.listdir(category_path) if f.endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            all_options[category] = sorted(files)
        else:
            all_options[category] = []

    return {
        "user": user,
        "list_clothes": list_clothes,
        "name_classes": name_classes,
        "all_options": all_options
    }