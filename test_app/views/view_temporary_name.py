from Project.render_page import render_page
from test_app.models import Test, Room

@render_page(template_name='temporary_name.html')
def render_temporary_name(code):  
    room = Room.query.filter_by(test_code=code).first()
    return {"room": code, "test": room}