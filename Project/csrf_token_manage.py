import flask
from .settings import project
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, RadioField
from wtforms.validators import DataRequired, Email, EqualTo, Length


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
    is_teacher = RadioField(
        "Role",
        choices= [('True', 'Викладач'), ('False', 'Користувач')],
        default= 'False',
        validators= [DataRequired()]
    )
    submit = SubmitField('Register')


class ChangePasswordForm(FlaskForm):
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


class ChangeUsernameForm(FlaskForm):
    username= StringField(
        'New username',
        validators= [DataRequired(), Length(min=3)]
    )
    submit = SubmitField('Пiдтвердити')