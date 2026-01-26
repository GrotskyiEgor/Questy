from user_app.models import Classes
from Project.render_page import render_page


@render_page(template_name='class_information.html')
def render_class_information(class_id):
    CLASS = Classes.query.filter_by(id=class_id).first()

    return {"class": CLASS}