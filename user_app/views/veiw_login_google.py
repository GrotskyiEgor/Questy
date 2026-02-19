from flask import url_for, redirect, session
from flask_login import login_user
from ..models import User
from Project.settings import google

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


