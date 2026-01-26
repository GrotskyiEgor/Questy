import flask, random
import Project
from Project.token_manage import RegisterForm

from ..models import User, UnconfirmedUser
from ..send_email import send_code

from Project.render_page import render_page

@render_page(template_name= 'sign_up.html')
def render_sign_up(): 
    form = RegisterForm()

    if form.validate_on_submit():
        name = form.username.data 
        password= form.password.data
        password_confirmation= form.confirm_password.data
        email = form.email.data
        user_role = True if form.is_teacher.data == 'True' else False

        if password != password_confirmation:
            print("1")
            return {"form": form, "message": "Not same password"}

        if User.query.filter_by(email= email).first():
            print("2")
            return {"form": form, "message": "Same username already has"}
        
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

    return {"form": form}