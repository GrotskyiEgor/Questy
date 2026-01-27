import random
from flask import session, redirect
from werkzeug.security import generate_password_hash

from ..models import User, UnconfirmedUser
from ..send_email import send_code
from Project.database import db
from Project.settings import project
from Project.render_page import render_page
from Project.csrf_token_manage import RegisterForm


@render_page(template_name='sign_up.html')
def render_sign_up(): 
    form = RegisterForm()
       
    if form.validate_on_submit():
        try:   
            name = form.username.data.strip()
            password = form.password.data
            confirm_password = form.confirm_password.data
            email = form.email.data
            role = form.is_teacher.data
            is_teacher= role == "True"
            
            if password != confirm_password:
                return {"message": "Паролі не співпадають"}
            
            if User.query.filter_by(email=email).first():
                return {"message": "Користувач з таким email вже існує"}
                
            code= random.randint(100000, 999999)
            
            unconfirm_user = UnconfirmedUser(
                username=name,
                email=email,
                password=generate_password_hash(password),
                is_teacher=bool(is_teacher),
                code=code
            )   

            db.session.add(unconfirm_user)
            db.session.commit()

            session["sign_up_email"] = email
        
            with project.app_context():
                send_code(user_email=email, code=code, type="confirm")

            return redirect(location='/confirmation_account')
            
        except Exception as error:
            print(error)
    
    return {"form": form}