import random 
from flask import request, session, redirect

from Project.settings import project
from ..send_email import send_code

from Project.render_page import render_page

@render_page(template_name = 'send_email.html')
def render_send_email():

    if request.method == 'POST':

        email = request.form['email'] 
        code = random.randint(100000, 999999)
        session["password_code"]= code
        session["email"]= email

        with project.app_context():
            send_code(user_email= email, code= code, type= "reset")
        
        return redirect(location = '/../reset_password')
    
    return { }