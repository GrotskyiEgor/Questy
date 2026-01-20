import flask
from .settings import project
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length
from flask_wtf.csrf import generate_csrf




@project.route('/get_csrf', methods=['GET'])
def get_csrf():
    token = generate_csrf()
    return {"csrf_token": token}


@project.route('/submit', methods=['POST'])
def submit():
    data = flask.request.form.get('data', '')
    return f"Received: {data}"

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = StringField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField(
        'Confirm password',
        validators=[DataRequired(), EqualTo('password')]
    )
    submit = SubmitField('Register')

class ChangePasswordForm(FlaskForm):
    old_password = PasswordField('Old password', validators=[DataRequired()])
    new_password = PasswordField('New password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField(
        'Confirm new password',
        validators=[DataRequired(), EqualTo('new_password')]
    )
    submit = SubmitField('Change password')

class EmailCodeConfirmForm(FlaskForm):
    code = StringField(
        'Confirmation code',
        validators=[DataRequired()]
    )
    submit = SubmitField('Confirm')

class ResetPasswordRequestForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Send code')

class ResetPasswordForm(FlaskForm):
    new_password = PasswordField('New password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField(
        'Confirm password',
        validators=[DataRequired(), EqualTo('new_password')]
    )
    submit = SubmitField('Reset password')
