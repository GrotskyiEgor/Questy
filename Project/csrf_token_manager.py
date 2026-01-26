import flask
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from flask_wtf.csrf import generate_csrf


from .settings import project

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = StringField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

@project.route('/get_csrf', methods=['GET'])
def get_csrf():
    token = generate_csrf()
    return {"csrf_token": token}


@project.route('/submit', methods=['POST'])
def submit():
    data = flask.request.form.get('data', '')
    return f"Received: {data}"

