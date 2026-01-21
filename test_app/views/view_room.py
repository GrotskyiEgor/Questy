import flask, Project, datetime

from flask_socketio import join_room, emit, disconnect
from Project.render_page import render_page
from Project.database import db
from ..models import Test, Room, Quiz
from user.models import User, Score

users= {}
devices= {}
user_devices= {}

def get_sid(username):
    for sid, name in users.items():
        if name == username:
            return sid
    
    return None

def room_get_result(room, author_name, username):
    room_get_result_data= {}
    
    ROOM= Room.query.filter_by(test_code= room).first()
    QUIZ_LIST = Quiz.query.filter_by(test_id= ROOM.test_id).all()
     
    users_list= ROOM.all_members.strip('|').split('||')
    USER_LIST= []
    UNREG_USER_LIST= []
    SCORE_LIST= []

    for user in users_list:
        if user:
            USER= User.query.filter_by(username= user).first()
            if USER:
                if USER.username != author_name:
                    USER_LIST.append(USER)
            else:
                if user != author_name:
                    UNREG_USER_LIST.append(user)

    SCORE_LIST= Score.query.filter_by(test_code= room).all()

    if (USER_LIST):
        for user in USER_LIST:
            answers_list= []
            answers_str= ""
            correct_answers_list= []
            timers_list= []
            token_list= []

            for score in SCORE_LIST:
                if score.user_id == user.id:
                    timers_list= score.user_timers.split("|")
                    token_list= score.user_tokens.split("|")
                    answers_str= score.user_answer
            
            if (answers_str):
                answers_list= answers_str.strip('|').split('||')

                for index, quiz in enumerate(QUIZ_LIST):
                    if answers_list[index] == "not_answer":
                        correct_answers_list.append(2)
                        continue
                    
                    if quiz.question_type  == "multiple_choice":
                        multi_choice_correct= quiz.correct_answer.split("%$№")
                        multi_choice_answer= answers_list[index].split("$$$")
                        sorted_multi_choice_correct= sorted(multi_choice_correct)
                        sorted_multi_choice_answer= sorted(multi_choice_answer)
                        if sorted_multi_choice_correct == sorted_multi_choice_answer:
                            correct_answers_list.append(1)
                        else:
                            correct_answers_list.append(0)
                    else:
                        if quiz.correct_answer == answers_list[index]:
                            correct_answers_list.append(1)
                        else:
                            correct_answers_list.append(0)

                room_get_result_data[user.username]= {
                    "correct_answers_list": correct_answers_list,
                    "timers_list": timers_list,
                    "token_list": token_list       
                }

    if(UNREG_USER_LIST):
        for user in UNREG_USER_LIST:
            answers_list= []
            answers_str= ""
            correct_answers_list= []
            timers_list= []
            token_list= []

            for score in SCORE_LIST:        
                if score.user_name == user:
                    timers_list= score.user_timers.split("|")
                    token_list= score.user_tokens.split("|")
                    answers_str= score.user_answer
            
            if (answers_str):
                answers_list= answers_str.strip('|').split('||')

                for index, quiz in enumerate(QUIZ_LIST):
                    if answers_list[index] == "not_answer":
                        correct_answers_list.append(2)
                        continue

                    if quiz.question_type  == "multiple_choice":
                        multi_choice_correct= quiz.correct_answer.split("%$№")
                        multi_choice_answer= answers_list[index].split("$$$")
                        sorted_multi_choice_correct= sorted(multi_choice_correct)
                        sorted_multi_choice_answer= sorted(multi_choice_answer)
                        if sorted_multi_choice_correct == sorted_multi_choice_answer:
                            correct_answers_list.append(1)
                        else:
                            correct_answers_list.append(0)
                    else:
                        if quiz.correct_answer == answers_list[index]:
                            correct_answers_list.append(1)
                        else:
                            correct_answers_list.append(0)

                room_get_result_data[user]= {
                    "correct_answers_list": correct_answers_list,
                    "timers_list": timers_list,
                    "token_list": token_list         
                }

    BEST_SCORE= None
    best_accuracy= 0
    averega_accuracy= 0
    averega_score= 0

    for score in SCORE_LIST:
        averega_accuracy += score.accuracy
        if score.accuracy > best_accuracy:
            BEST_SCORE= score

    if len(SCORE_LIST) > 0:
        averega_score= averega_accuracy//len(SCORE_LIST)
    else:
        averega_score= 0

    best_score_data= {
            "user_name": "None",
            "accuracy": 0
        }

    if BEST_SCORE:
        best_score_data= {
            "user_name": BEST_SCORE.user_name,
            "accuracy": BEST_SCORE.accuracy,
        }
    elif len(SCORE_LIST) == 1:
        best_score_data= {
            "user_name": SCORE_LIST[0].user_name,
            "accuracy": SCORE_LIST[0].accuracy,
        }

    return room_get_result_data, best_score_data, averega_score

@Project.settings.socketio.on('join')
def handle_join(data):
    room= data['room']
    username= data['username']
    device_id= data["device_id"]
    user_sid= flask.request.sid

    if device_id in devices:
        emit("kicked", {"succses": "succses"}, to= user_sid)
        disconnect(sid= user_sid)

    users[user_sid]= username
    devices[device_id]= user_sid
    user_devices[username]= device_id
    join_room(room)

    test= Test.query.filter_by(test_code = room).first()
    ROOM= Room.query.filter_by(test_code = room).first()
    
    if not ROOM:
        NEW_ROOM = Room(
            test_id= test.id,
            test_code= room,
            user_list= f'|{username}|',
            author_name= username,
            active_test= False,
            all_members= ""
        )
        db.session.add(NEW_ROOM)

    else:
        new_user = f'|{username}|'
        if new_user not in ROOM.user_list:
            ROOM.user_list += new_user
            if username != test.author_name and username not in ROOM.all_members:
                ROOM.all_members += new_user

    db.session.commit()

@Project.settings.socketio.on('disconnect')
def handle_disconnect():
    username = users.pop(flask.request.sid, None)
    users.pop(flask.request.sid, None)

    if username:
        device_id= user_devices.pop(username, None)
        if device_id:
            devices.pop(device_id, None)
            ROOM = Room.query.filter(Room.user_list.like(f"%|{username}|%")).first()

            if ROOM and ROOM.user_list:
                ROOM.user_list = ROOM.user_list.replace(f"|{username}|", "")
                db.session.commit()

                emit('user_disconnected', {
                        'msg': f'{username} відключився',
                        "username": f"{username}"
                        }, 
                    to=ROOM.test_code)

@Project.settings.socketio.on('reconnect_user')
def handle_reconnect_user(data):
    author = data['author_name']
    author_sid = get_sid(author)

    emit("reconnect_ping", {"room": data["room"], "username": data["username"]}, room= author_sid)

@Project.settings.socketio.on('new_state')
def handle_new_state(data):
    new_state= data["new_state"]
    username= data["username"]
    user_sid= get_sid(username)

    emit("new_state", {"room": data["room"], "username": username, "new_state": new_state, "new_time": data["new_time"]}, room= user_sid)

@Project.settings.socketio.on('test_end')
def handle_clear_test_code(data):
    room = data['room']
    ROOM= Room.query.filter_by(test_code= room).first()

    if ROOM:
        db.session.delete(ROOM)

    TEST = Test.query.filter_by(test_code= room).first()
    if (TEST):
        TEST.test_code = 0  
        
    db.session.commit()
    
@Project.settings.socketio.on('kick_user')
def handle_kick_user(data):
    username = data['user']
    room = data['room']
    
    device_id= user_devices.get(username)
    kick_sid= devices.get(device_id)

    if kick_sid:
        emit('kicked', room= kick_sid)
        disconnect(sid= kick_sid)

        users.pop(kick_sid, None)
        devices.pop(device_id, None)
        user_devices.pop(username, None)

        ROOM = Room.query.filter_by(test_code=room).first()
        ROOM.user_list = ROOM.user_list.replace(f"|{username}|", "")
        db.session.commit()
        
        disconnect(sid= kick_sid)
    else:
        print(f"Користувача {username} не знайдено серед підключених.")

@Project.settings.socketio.on('get_usernames')
def handle_send_usernames(data):
    room = data['room']
    author = data['author_name']
    author_sid = get_sid(author)

    ROOM = Room.query.filter_by(test_code = room).first()

    users_in_room = ROOM.user_list.split('|')
    clean_users_in_room = []
    for user in users_in_room:
        if user != author and user:
            clean_users_in_room.append(user)

    emit("get_usernames", clean_users_in_room, room= author_sid)

@Project.settings.socketio.on('user_answers')
def handle_user_answers(data):
    room= data["room"]
    user_name= data["username"]
    user_tokens= data["user_tokens"]
    tokens= 0
    new_token_list= None
    ROOM = Room.query.filter_by(test_code= room).first()
    TEST = Test.query.filter_by(id= ROOM.test_id).first()
    QUIZ_LIST = Quiz.query.filter_by(test_id= ROOM.test_id).all()

    
    user_answers = data["user_answers"].split("|")
    user_answers_list = []
    for answer in user_answers:
        if answer != "":
            user_answers_list.append(answer)

    for token in user_tokens.split("|"):
        if token:
            tokens += int(token)
    
    number_of_correct_answers = 0
    user_tokens= user_tokens.split("|")

    for index in range(len(QUIZ_LIST)):
        user= user_answers_list[index].split("$$$")
        quiz= QUIZ_LIST[index].correct_answer.split("%$№")
        if sorted(user) == sorted(quiz):
            number_of_correct_answers += 1
        else:
            user_tokens[index]= 0

    for token in user_tokens:
        if new_token_list == None:
            new_token_list = f"{token}"
        else:
            new_token_list += f"|{token}"

    accuracy = number_of_correct_answers / len(QUIZ_LIST) * 100
    accuracy = int(accuracy)
    USER = User.query.filter_by(username= user_name).first()

    SCORE = Score(
        user_answer= data["user_answers"],
        user_timers= data["user_timers"],
        user_tokens= new_token_list,
        accuracy= accuracy,
        test_id= TEST.id,
        date_complete = datetime.date.today(),
        time_complete= datetime.datetime.now().strftime("%H:%M:%S"),
        user_id= USER.id if USER else 0,
        user_name= user_name,
        test_code= room
    )

    if (USER):
        if USER.tokens:
            USER.tokens = int(USER.tokens) + tokens
        else:
            USER.tokens= tokens

    db.session.add(SCORE)
    db.session.commit()

@Project.settings.socketio.on('user_answer')
def handle_user_answer(data):
    author_name = data['author_name']
    username= data['username']
    answer= data['answer']
    
    author_sid = get_sid(author_name)

    emit("author_receive_answer", {"username": username, "answer": answer}, room= author_sid)

@Project.settings.socketio.on('get_room_size')
def handle_get_room_size(data):
    room= data["room"]
    author_name= data["author_name"]

    author_sid= get_sid(author_name)
    
    count_users = 0
    ROOM = Room.query.filter_by(test_code = room).first()
    user_str = ROOM.user_list
    
    for user in user_str.split('|'):
        if user != "":
            count_users = count_users + 1

    count_users = count_users - 1
    
    emit("recieve_count_users", {
        "room": room,
        "countUsers": count_users
        }
    , to= author_sid)

@Project.settings.socketio.on('author_start_test')
def handle_start_test(data):
    room = data['room']
    test= Test.query.filter_by(test_code = room).first()
    
    ROOM= Room.query.filter_by(test_code= room).first()
    user_list= ROOM.user_list.replace(f"|{ROOM.author_name}|", "")

    if (user_list):
        ROOM.active_test= True
        db.session.commit()
        
        emit("start_test", {
            "room": room,
            "test_id": test.id,
            "author_name": test.author_name
            }
        , to=room)

@Project.settings.socketio.on('message_to_chat')
def handle_message_to_chat(data):
    emit("listening_to_messages", f"{data['username']}: {data['message']}", include_self= False, to= data['room'])

@Project.settings.socketio.on('new_user')
def handle_new_user(data):
    room= data['room']
    username= data['username']

    user_sid = get_sid(username)

    emit("create_user_block", {"username": username, "user_ip": data["user_ip"]}, to= room)

@Project.settings.socketio.on('new_user_admin')
def handle_new_user_admin(data):
    author_name= data["author_name"]
    connected= data.get("connected", 0)

    author_sid = get_sid(author_name)
    emit("new_user_admin", {"username": data["username"], "ip": data["ip"], "connected": connected}, to= author_sid)

@Project.settings.socketio.on('next_question')
def handle_next_question(data):
    emit("next_question", f"Next question in {data['room']} author {data['author_name']}", include_self= False, to= data['room'])

@Project.settings.socketio.on('stop_test')
def handle_stop_test(data):
    emit("result_test", f"Stop test {data['room']} result_test page author {data['author_name']}", include_self= False, to= data['room'])

@Project.settings.socketio.on('end_test')
def handle_end_test(data):
    room= data["room"]
    emit("kicked", room, include_self= False, to= room)

@Project.settings.socketio.on('room_get_result')
def handle_room_get_result(data):
    user_sid= get_sid(data["username"])
    room_get_result_data, best_score_data, averega_score= room_get_result(data["room"], data["author_name"], data["username"])
   
    emit("room_get_result_data", {"room_get_result_data": room_get_result_data,
                                  "best_score_data": best_score_data,
                                  "averega_score": averega_score}, to= user_sid)

@Project.settings.socketio.on('plus_time')
def handle_plus_time(data):
    emit("plus_time", to= data['room'])

@Project.settings.socketio.on('change_time')
def handle_change_time(data):
    emit("change_time", to= data['room'])

@render_page(template_name = 'room.html')
def render_room(test_code):
    list_answers = []
    list_quiz = []

    test = Test.query.filter_by(test_code= test_code).first()

    if not test:
        return flask.redirect("/")

    quizzes_list = Quiz.query.filter_by(test_id= test.id).all()

    for quiz in quizzes_list:
        if quiz.question_type == "input":
            list_answers.append(quiz.correct_answer)
            list_quiz.append(quiz.dict())
        else :
            list_answers.append(quiz.answer_options.split("%$№"))
            list_quiz.append(quiz.dict()) 

    test = Test.query.filter_by(test_code= test_code).first()

    return {
        "test": test,
        "list_quiz": list_quiz,
        "list_answers": list_answers,
    }

def delete_code(test_id):
    test= Test.query.filter_by(id= test_id).first()
    test.test_code = 0
    Project.database.db.session.commit()

    return flask.redirect("/quizzes/")