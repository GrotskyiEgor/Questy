from datetime import datetime, timedelta
from flask_login import UserMixin

from Project.database import db


class_user= db.Table(
    "class_user",
    db.Column("class_id", db.Integer, db.ForeignKey("classes.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"))
)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    tokens= db.Column(db.Integer, default=0)
    avatar = db.Column(db.String(20), default="1|1|1|1|1")
    is_teacher = db.Column(db.Boolean)
    is_admin = db.Column(db.Boolean, default=0)

    classes = db.relationship('Classes', secondary=class_user, back_populates='users')


    def __repr__(self):
        return f'User: {self.username}'
    

    def dict(self):
        return {
            "id": self.id,
            "username": self.username
        }
    

class UnconfirmedUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    is_teacher = db.Column(db.Boolean)
    is_admin = db.Column(db.Boolean, default=0)

    code = db.Column(db.Integer, nullable=False)
    create_time = db.Column(db.DateTime, default=datetime.utcnow)


    def time_registration(self):
        if datetime.utcnow() - self.create_time > timedelta(minutes= 15):
            return False
        else:
            return True


class Classes(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100), nullable=False)
    lesson = db.Column(db.String(200), nullable=True, default="lesson")
    class_code = db.Column(db.String(100), nullable= False)
    created_date = db.Column(db.String(100), nullable= False)
    class_color1 = db.Column(db.String(100), nullable=True)
    class_color2 = db.Column(db.String(100), nullable=True)

    max_user_count = db.Column(db.Integer, nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"))
    teacher = db.relationship("User", backref="classes_created")
    
    tasks = db.relationship('Task', backref='classes', cascade="all, delete-orphan")
    users = db.relationship('User', secondary=class_user, back_populates="classes")


    def dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "lesson": self.lesson,
            "class_code": self.class_code,
            "teacher": self.teacher.dict(),
            "class_color1": self.class_color1,
            "class_color2": self.class_color2
        }


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_answer = db.Column(db.String, nullable=False)
    user_timers = db.Column(db.String)
    user_tokens = db.Column(db.String)
    accuracy = db.Column(db.Integer, nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id', ondelete="SET NULL"))

    date_complete = db.Column(db.String, nullable=False)
    time_complete = db.Column(db.String, nullable=False)

    task_test_id = db.Column(db.Integer, db.ForeignKey("task.id", ondelete="SET NULL"))
    class_id = db.Column(db.Integer, db.ForeignKey("classes.id", ondelete="SET NULL"))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=True)
    user_name = db.Column(db.String, nullable=False)

    test_code = db.Column(db.Integer, nullable=True)


    def __repr__(self):
        return f"{self.user_answer}\n{self.user_timers}\n{self.user_tokens}"


    def dict(self):
        return {
            "id": self.id,
            "test_id": self.test_id,
            "accuracy": self.accuracy,
            "date_complete": self.date_complete,
            "time_complete": self.time_complete
        }


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    due_time = db.Column(db.DateTime, nullable=True)
    work_after_time = db.Column(db.Boolean, default=False)

    online = db.Column(db.Boolean, nullable=True)

    class_id = db.Column(db.Integer, db.ForeignKey("classes.id", ondelete="CASCADE"))
    test_id = db.Column(db.Integer, db.ForeignKey("test.id", ondelete="CASCADE"), nullable=True)
    image = db.Column(db.Boolean, default=False)

    test = db.relationship("Test", backref="tasks")
    
    
    def dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "due_time": self.due_time.strftime('%d.%m.%Y %H:%M') if self.due_time else None,
            "work_after_time": self.work_after_time
        }

