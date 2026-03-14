const passwordInput = document.querySelector('input[name="password"]')
const lockImgs = document.querySelectorAll('.lock')

lockImgs.forEach(lockImg => { 
    lockImg.addEventListener('click', function() {
        const input = this.closest('.input-box').querySelector('input')
        
        if (input.type === "password"){
            input.type = "text"
            this.src = "/user_app/static/images/lock-open.png"
        } else {
            input.type = "password"
            this.src = "/user_app/static/images/lock.png"
        }
    })
});