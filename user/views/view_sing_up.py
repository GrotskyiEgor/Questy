import random

from flask import request, session, redirect

from Project import db, project
from ..models import User, UnconfirmedUser
from ..send_email import send_code
from Project.render_page import render_page

@render_page(template_name= 'sign_up.html')
def render_sign_up(): 
       
    if request.method == 'POST':
        try:   
            name = request.form['name'].strip()
            password= request.form['password'] 
            password_confirmation= request.form['password-confirmation']
            email= request.form['email']
            role = request.form['is_teacher']
            user_role= None
            if role == "False":
                user_role= False
            else:
                user_role= True

            db_user_email= User.query.filter_by(email= email).first()

            if password == password_confirmation and db_user_email is None: 
                code= random.randint(100000, 999999)
                
                unconfirm_user = UnconfirmedUser(
                    username = name,
                    email = email,
                    password = password,
                    is_teacher = bool(user_role),
                    code= code
                )   

                db.session.add(unconfirm_user)
                db.session.commit()

                session["sign_up_email"]= email
            
                with project.app_context():
                    send_code(user_email=email, code= code, type= "confirm")

                return redirect(location = '/confirmation_account')

            else:
                print('Not same password', password, password_confirmation, db_user_email
                      , password == password_confirmation)

                
        except Exception as error:
            print(error)
    
    return { }