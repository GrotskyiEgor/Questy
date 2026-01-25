import flask

from ..models import Test
from Project.database import db
from Project.render_page import render_page


@render_page(template_name = 'edit_head_test.html')
def render_edit_header(test_id):

    test= Test.query.filter_by(id=test_id).first()

    if flask.request.method == "POST":

        if flask.request.form["title"]:
            title = flask.request.form["title"]
            test.title = title

        if flask.request.form["description"]:
            description = flask.request.form["description"]
            test.description = description

        db.session.commit()

        return flask.redirect(f"/test_app?test_id={test.id}")

    return {}