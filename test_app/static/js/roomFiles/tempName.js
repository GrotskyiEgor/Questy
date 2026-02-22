const tempButton = document.querySelector(".submit-btn");
const tempInput = document.querySelector(".input-name");

const room = window.room;
const author = window.author;

tempInput.addEventListener('keydown', function(event){
    if (event.key === "Enter"){
        tempButton.click()
    }
})

tempButton.addEventListener('click', function() {
    if (author === tempInput.value){
        window.location.href = `/`; 
    }

    setCookie("temporaryName", tempInput.value)
    window.location.href = `/room${room}`; 
});
