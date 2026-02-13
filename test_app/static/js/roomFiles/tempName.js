const tempButton = document.querySelector(".submit-btn");
const tempInput = document.querySelector(".input-name");

const room = window.room;
const author = window.author;

tempButton.addEventListener('click', function() {
    if (author === tempInput.value){
        window.location.href = `/`; 
    }

    setCookie("temporaryName", tempInput.value)
    window.location.href = `/room${room}`; 
});
