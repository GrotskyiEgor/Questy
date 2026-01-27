from flask import request, session, redirect
from werkzeug.security import generate_password_hash

from ..models import User
from Project.database import db
from Project.render_page import render_page
from Project.csrf_token_manage import ChangePasswordForm

@render_page(template_name='new_password.html')
def render_new_password():
    form = ChangePasswordForm()

    if form.validate_on_submit():
        new_password = form.new_password.data
        conf_password = form.confirm_password.data

        email = session.get("email", " ")

        for user in User.query.filter_by(email = email):
            if user and new_password == conf_password:
                user.password = generate_password_hash(new_password)
                db.session.commit()
                
                return redirect(location='/../login')
    
    return {"form": form}