const buttonsArrey = document.querySelectorAll(".answer")
const multipleChoiceButtons = document.querySelectorAll(".multiple-answer")

const inputField = document.querySelector(".input-with-answer")
const inputButton = document.querySelector(".input-answer")
const multipleChoiceButton = document.querySelector(".multiple-choice-answer")

if (inputButton){
    inputField.addEventListener("keyup", function(event){
        if (event.key === 'Enter'){
            inputButton.click()
        }
    });

    inputButton.addEventListener("click", function(event) {   
        let userAnswer= getCookie("userAnswers")
        let answerValue= ""

        const input= document.querySelector(".input-with-answer")
        if (input){
            answerValue= input.value
        }

        if (!answerValue){
            answerValue= "not_answer"
        }
            
        if (!userAnswer){
            setCookie("userAnswers", answerValue) 
        } 
        else{
            setCookie("userAnswers", `${userAnswer}|${answerValue}`) 
        }  

        window.location.href= inputButton.dataset.nextUrl
    })
}

if (multipleChoiceButton){
    multipleChoiceButton.addEventListener("click", function(event) {
        let answerValue= ""
        let currentAnswers= getCookie("userAnswers");

        for (const value of document.querySelectorAll(".active-multiple-answer")){
            if (!answerValue){
                answerValue += value.id
            }
            else{
                answerValue += "$$$" + value.id
            }
        }
        
        if (!answerValue){
            answerValue= "not_answer"
        }

        if (!currentAnswers){
            setCookie("userAnswers", answerValue) 
        } else{
            userAnswer = getCookie("userAnswers");
            document.cookie = `userAnswers=${userAnswer}|${answerValue}; path= /`
            setCookie("userAnswers", `${userAnswer}|${answerValue}`)     
        }

        window.location.href = multipleChoiceButton.dataset.nextUrl
    })
}

for (let count = 0; count < multipleChoiceButtons .length; count++ ) {
    let button= multipleChoiceButtons [count];

    const checkmark = document.createElement("span")
    checkmark.classList.add("checkmark")
    checkmark.textContent = "✓"
    
    button.addEventListener(
        type= "click" ,
        listener= function (event) {
            if (button.className === "multiple-answer"){
                button.className= "active-multiple-answer"
                button.appendChild(checkmark)

            }
            else{
                button.className= "multiple-answer"
                button.removeChild(checkmark)
            }
        }
    )
}


for (let count = 0; count < buttonsArrey.length; count++ ) {
    let button= buttonsArrey[count];
    button.addEventListener(
        type= "click" ,
        listener= function (event) {
            let currentAnswers= getCookie("userAnswers");
            
            if (!currentAnswers){
                setCookie("userAnswers", button.id) 
            }
            else{
                userAnswer = getCookie("userAnswers");
                setCookie("userAnswers", `${userAnswer}|${button.id}`) 
            }      
        }
    )
}
