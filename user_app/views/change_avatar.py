from flask import request
from flask_login import login_required, current_user
from user_app import user_app
from ..models import User

@user_app.route('/profile/avatar', methods = ['POST'])
@login_required
def save_avatar():
    avatar = request.json['avatar']
    current_user.avatar = avatar
    User.session.commit()
    return {'status': 'ok'}