import flask
import random 

from Project.settings import project
from ..send_email import send_code
from Project.token_manage import ResetPasswordRequestForm
from Project.render_page import render_page

@render_page(template_name='send_email.html')
def render_send_email():
    form = ResetPasswordRequestForm()
    
    if form.validate_on_submit():
        email = form.email.data
        code = random.randint(100000, 999999)
        flask.session["password_code"] = code
        flask.session["email"] = email

        with project.app_context():
            send_code(user_email=email, code=code, type="reset")
        
        return flask.redirect(location='/../reset_password')
    
    return {"form": form}
