import flask
from flask_login import login_user, current_user
from werkzeug.security import check_password_hash

from ..models import User
from Project.render_page import render_page
from Project.token_manage import LoginForm

from Project.token_manage import LoginForm

@render_page(template_name= 'login.html')
def render_login_app():
    form = LoginForm()

    if form.validate_on_submit():
        email= form.email.data
        password= form.password.data
        
        user = User.query.filter_by(email= email).first()
        
        if user and user.email == email and check_password_hash(user.password, password): 
            login_user(user)
            return flask.redirect('/')
                
    if not current_user.is_authenticated:
        return {"form": form}
    else:
        return flask.redirect('/')
