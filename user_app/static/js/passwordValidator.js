function validatePassword(event){
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("password-confirmation").value;
    const error = document.getElementById('error-message');

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~`-]).{6,}$/;

    if (!regex.test(password)) {
        error.textContent = "Пароль повинен містити хоча б одну велику літеру, цифру і спецсимвол (мін. 6 символів).";
        event.preventDefault();
        return false;
    }
    
    if (password != confirm_password){
        error.textContent = 'Паролі не співпадають.';
        event.preventDefault();
        return false
    }

    error.textContent = '';
    return true;
}