const tempButton = document.querySelector(".submit-btn");
const tempInput = document.querySelector(".input-name");

const room = window.room;

tempButton.addEventListener('click', function() {
    setCookie("temporaryName", tempInput.value)
    window.location.href = `/room${room}`; 
});
