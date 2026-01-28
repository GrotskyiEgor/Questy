def check_password(password: str) -> bool:
    '''
    Docstring for check_password
    
    :param password: Description
    :return: Description
    :rtype: bool
    '''
    symbols = "! @ # $ % ^ & * ( ) _ + - = { } [ ] | \\ : ; \" ' < > , . ? / ~ `"
    if symbols in password:
        return True
    return False