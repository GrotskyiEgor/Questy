import flask

from Project.database import db
from user_app.models import User
from flask_login import current_user
from Project.render_page import render_page
from Project.csrf_token_manage import ChangeUsernameForm


@render_page(template_name = 'edit_profile.html')
def render_edit_profile(user_id):
    if current_user.id != int(user_id):
        return flask.redirect("/profile")
    
    form= ChangeUsernameForm()
    user = User.query.filter_by(id= user_id).first()

    if form.validate_on_submit():
        user.username = form.username.data
        db.session.commit()
        return flask.redirect("/profile")
    
    return {"form": form}
