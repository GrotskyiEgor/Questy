const passwordInput = document.querySelector('input[name="password"]')
const lockImg = document.querySelector('.lock')

lockImg.addEventListener('click', function() {
    if (passwordInput.type === "password"){
        passwordInput.type = "text"
        lockImg.src = "/user_app/static/images/lock-open.png"
    } else {
        passwordInput.type = "password"
        lockImg.src = "/user_app/static/images/lock.png"
    }
})