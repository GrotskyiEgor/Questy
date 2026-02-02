from flask import url_for, redirect, session
from Project.settings import google
from werkzeug.security import check_password_hash
from flask_login import login_user, current_user

from ..models import User
from Project.render_page import render_page
from Project.csrf_token_manage import LoginForm

def google_login():
    redirect_uri = url_for('user_app.google_authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

def google_authorize():
    token = google.authorize_access_token()
    user_info = google.userinfo()
    
    try:
        email = user_info['email']
        name = user_info.get('name', email.split('@')[0])
    except Exception as error:
        print(error) 

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, username=name, password=None)
        user.save() 

    login_user(user)
    return redirect('/')


@render_page(template_name='login.html')
def render_login_app():
    form = LoginForm()

    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        
        print(email, password)
        user = User.query.filter_by(email= email).first()
        
        if user and user.email == email and check_password_hash(user.password, password): 
            login_user(user)
            return redirect('/')
                
    if not current_user.is_authenticated:
        return {"form": form}
    else:
        return redirect('/')


