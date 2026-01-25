from Project.render_page import render_page


@render_page(template_name='temporary_name.html')
def render_temporary_name(code):  
    return {"room": code}