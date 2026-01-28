from email_validator import validate_email, EmailNotValidError

def check_email(email) -> bool:
    '''
    Docstring for check_email
    
    :param email: Description
    :return: Description
    :rtype: bool
    '''
    try:
        validate_email(email, check_deliverability=True)
        return True
    except EmailNotValidError:
        return False