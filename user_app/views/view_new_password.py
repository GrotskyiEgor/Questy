from flask import request, session, redirect
from werkzeug.security import generate_password_hash

from ..models import User
from Project.database import db
from Project.render_page import render_page

@render_page(template_name='new_password.html')
def render_new_password():
    if request.method == "POST":
        new_password = request.form['new_pas']
        conf_password = request.form['new_pas_conf']

        email = session.get("email", " ")

        for user in User.query.filter_by(email = email):
            if user and new_password == conf_password:
                user.password = generate_password_hash(new_password)
                db.session.commit()
                
                return redirect(location='/../login')
    
    return { }