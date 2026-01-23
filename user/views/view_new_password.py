import flask, Project
from ..models import User

from Project.render_page import render_page
from Project.token_manage import ChangePasswordForm
from werkzeug.security import generate_password_hash

@render_page(template_name= 'new_password.html')
def render_new_password():
    form = ChangePasswordForm()
    
    if form.validate_on_submit():
        new_password = form.new_password.data
        conf_password = form.confirm_password.data
        email= flask.session.get("email", " ")

        if not email:
            return flask.redirect(location = '/login')

        user= User.query.filter_by(email = email).first()     
        if user:
            user.password = generate_password_hash(new_password)
            Project.db.session.commit()

            flask.session.pop("email", None)     
            return flask.redirect(location = '/login')
    
    return {"form": form}