import flask

from Project.database import db
from user_app.models import User
from flask_login import current_user
from Project.render_page import render_page


@render_page(template_name = 'edit_profile.html')
def render_edit_profile(user_id):
    if current_user.id == int(user_id):
        user = User.query.filter_by(id=user_id).first()

        if flask.request.method == "POST":
            if flask.request.form.get("name"):
                user.username = flask.request.form.get("name")
                db.session.commit()
                return flask.redirect("/profile")
    else:
        return flask.redirect("/profile")
    
    return { }
