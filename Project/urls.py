from home_app import *
from user_app import *
from test_app import *
from class_app import *

# HOME APP
home_app.add_url_rule(rule="/", view_func=render_home)
home_app.add_url_rule(rule='/get_active_codes', view_func=get_codes, methods=['GET', 'POST'])

home_app.add_url_rule(rule="/profile/", view_func=render_profile, methods=['GET', 'POST'])
home_app.add_url_rule(rule="/profile/sorte", view_func=profile_sorte, methods=['GET', 'POST', 'PUT'])
home_app.add_url_rule(rule="/edit_profile<user_id>", view_func=render_edit_profile, methods=['GET', 'POST'])
home_app.add_url_rule(rule="/edit_avatar<user_id>", view_func=render_edit_avatar, methods=['GET', 'POST'])

home_app.add_url_rule(rule='/quizzes/', view_func=render_quizzes, methods=['GET', 'POST'])
home_app.add_url_rule(rule='/delete_test<test_id>', view_func=delete_test, methods=['GET', 'POST'])
home_app.add_url_rule(rule='/reset_test<test_id>', view_func=reset_test, methods=['GET', 'POST'])

# USER APP
user_app.add_url_rule(rule="/sign_up/", view_func=render_sign_up, methods=['GET', 'POST'])

user_app.add_url_rule(rule="/send_email_app/", view_func=render_send_email, methods=['GET', 'POST'])
user_app.add_url_rule(rule='/new_password/', view_func=render_new_password, methods=['POST', 'GET'])
user_app.add_url_rule(rule='/reset_password/', view_func=render_reset_app, methods=['POST', 'GET'])
user_app.add_url_rule(rule='/confirmation_account/', view_func=render_confirm_account, methods=['POST', 'GET'])

user_app.add_url_rule(rule='/login/', view_func=render_login_app, methods =['GET', 'POST'])
user_app.add_url_rule(rule="/logout/", view_func=loguot, methods=['GET', 'POST'])

# TEST APP
test_app.add_url_rule(rule='/test_app', view_func=render_test_app, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/new_quiz/', view_func=render_new_quiz, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/room<test_code>', view_func=render_room, methods=['GET', 'POST'])

test_app.add_url_rule(rule='/edit_question', view_func=render_edit_question, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/edit_header_test<test_id>', view_func=render_edit_header, methods=['GET', 'POST'])

test_app.add_url_rule(rule='/passing_test', view_func=render_passing_test, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/result_test', view_func=render_test_result, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/create_test', view_func=render_create_test, methods=['GET', 'POST'])

test_app.add_url_rule(rule='/delete_test<test_id>', view_func=delete_test, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/delete_quiz<quiz_id>', view_func=delete_quiz_question, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/delete_code<test_id>', view_func=delete_code, methods=['GET', 'POST'])
test_app.add_url_rule(rule='/create_code<test_id>', view_func=created_test, methods=['GET', 'POST'])

test_app.add_url_rule(rule='/review_results<id>', view_func=render_review_results, methods=['GET', 'POST'])
test_app.add_url_rule(rule="/temporary_name<code>", view_func=render_temporary_name, methods=['GET', 'POST'])

test_app.add_url_rule(rule="/build_test", view_func=create_test, methods=['GET', 'POST'])

# CLASS APP
class_app.add_url_rule(rule='/class_page', view_func= render_class_page, methods= ['GET', 'POST'])
class_app.add_url_rule(rule="/class_page/sorte", view_func= class_sorte, methods= ['GET', 'POST', 'PUT'])

class_app.add_url_rule(rule="/class_courses<id>", view_func= render_class_courses, methods= ['GET', 'POST'])

class_app.add_url_rule(rule='/task_page', view_func=render_task_page, methods= ['GET', 'POST'])
class_app.add_url_rule(rule="/create_task<id>", view_func=render_create_task, methods= ['GET', 'POST'])
class_app.add_url_rule(rule="/result_task", view_func=render_result_task, methods= ['GET', 'POST'])

class_app.add_url_rule(rule='/class_information<class_id>', view_func=render_class_information, methods=['GET', 'POST'])
class_app.add_url_rule(rule='/delete_user', view_func=delete_user, methods=['GET', 'POST'])

class_app.add_url_rule(rule='/delete_class<class_id>', view_func=delete_class, methods=['GET', 'POST'])
class_app.add_url_rule(rule='/delete_task<task_id>', view_func=delete_task, methods=['GET', 'POST'])

class_app.add_url_rule(rule='/task_page/sorte', view_func=sorte_task, methods=['GET', 'POST', "PUT"])
class_app.add_url_rule(rule='/class_page/task', view_func=new_task, methods=['GET', 'POST', "PUT"])