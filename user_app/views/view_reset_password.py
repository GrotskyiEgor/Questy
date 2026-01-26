import flask
from flask_login import current_user, login_user
from werkzeug.security import generate_password_hash
from ..models import User, UnconfirmedUser

from Project.token_manage import EmailCodeConfirmForm

from Project.render_page import render_page
from Project.database import db

@render_page(template_name='reset_password.html')
def render_reset_app():
    form = EmailCodeConfirmForm()

    if form.validate_on_submit():
        password_code = flask.session.get("password_code")
        if not password_code:
            return flask.redirect('/login')

        try:
            code = int(form.code.data)
        except (TypeError, ValueError):
            return {}

        if code == int(password_code):
            return flask.redirect('/new_password')

    return {"form": form}


@render_page(template_name='confirm_password.html')
def render_confirm_account():
    form = EmailCodeConfirmForm()
    if form.validate_on_submit():
        sign_up_email= flask.session.get("sign_up_email", " ")
        code = int(form.code.data)

        ucconfirmed_user= UnconfirmedUser.query.filter_by(email= sign_up_email).first()
        
        if ucconfirmed_user and code == int(ucconfirmed_user.code):
            user = User(
                username = ucconfirmed_user.username,
                email = ucconfirmed_user.email,
                password = generate_password_hash(ucconfirmed_user.password),
                is_teacher = ucconfirmed_user.is_teacher
            )   

            db.session.add(user)
            db.session.delete(ucconfirmed_user)
            db.session.commit()
            login_user(user)
            return flask.redirect(location = '/')
        else: 
            return {"form": form, "message": "Невірний код"}
    
    if not current_user.is_authenticated:
        return { }
    else:
        return flask.redirect('/')




