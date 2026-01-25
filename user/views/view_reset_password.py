from flask import request, session, redirect
from flask_login import current_user, login_user
from werkzeug.security import generate_password_hash
from ..models import User, UnconfirmedUser

from Project.render_page import render_page
from Project.database import db

@render_page(template_name= 'reset_password.html')
def render_reset_app():

    if request.method == "POST":
        password_code= session.get("password_code", " ")
        code = int(request.form['code'])
        if code == password_code:
            return redirect(location = '/../new_password')
    
    return { }

@render_page(template_name= 'confirm_password.html')
def render_confirm_account():
    if request.method == "POST":
        sign_up_email= session.get("sign_up_email", " ")
        code = int(request.form['code'])

        ucconfirmed_user= UnconfirmedUser.query.filter_by(email = sign_up_email).first()
        
        if ucconfirmed_user and code == int(ucconfirmed_user.code):
            user = User(
                username = ucconfirmed_user.username,
                email = ucconfirmed_user.email,
                password= generate_password_hash(ucconfirmed_user.password),
                is_teacher = ucconfirmed_user.is_teacher
            )   

            db.session.add(user)

        db.session.delete(ucconfirmed_user)
        db.session.commit()

        if ucconfirmed_user and code == int(ucconfirmed_user.code):
            login_user(user)

        return redirect(location = '/../')
    
    if not current_user.is_authenticated:
        return { }
    else:
        return redirect('/')




