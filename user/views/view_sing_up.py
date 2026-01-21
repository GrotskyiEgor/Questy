import flask, random
import Project

from ..models import User, UnconfirmedUser
from ..send_email import send_code

from Project.render_page import render_page

@render_page(template_name= 'sign_up.html')
def render_sign_up(): 
       
    if flask.request.method == 'POST':
        try:   
            name = flask.request.form['name'].strip()
            password= flask.request.form['password'] 
            password_confirmation= flask.request.form['password-confirmation']
            email= flask.request.form['email']
            role = flask.request.form['is_teacher']
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

                Project.db.session.add(unconfirm_user)
                Project.db.session.commit()

                flask.session["sign_up_email"]= email
            
                with Project.project.app_context():
                    send_code(user_email=email, code= code, type= "confirm")

                return flask.redirect(location = '/confirmation_account')

            else:
                print('Not same password')
                           
        except Exception as error:
            print(error)
    
    return { }