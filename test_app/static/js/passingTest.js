const answerLinks = document.querySelectorAll(".answer-link")
const multipleChoiceButtons = document.querySelectorAll(".multiple-answer")

const inputField = document.querySelector(".input-with-answer")
const inputButton = document.querySelector(".input-answer")
const multipleChoiceButton = document.querySelector(".multiple-choice-answer")

const resultLine = document.querySelector(".result-line")

function showResult(type, nextUrl, delay = 2000) {
    const resultLine = document.querySelector(".result-line")
    const resultText = document.querySelector(".result-line-text")

    if (type){
        resultText.textContent = "Правильно ";
        resultText.style.color = "var(--green-text)"
    } else {
        resultText.textContent = "Неправильно";
        resultText.style.color = "var(--red-text)"
    }
    setTimeout(() => {
        resultLine.classList.add("show");
    }, 50)

    setTimeout(() => {
        window.location.href = nextUrl;
    }, delay)
}

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
        } else {
            answerValue= "not_answer"
        }
             
        if (!userAnswer){
            setCookie("userAnswers", answerValue) 
        } 
        else{
            setCookie("userAnswers", `${userAnswer}|${answerValue}`) 
        }  

        showResult(correct_answer_list[question_number] === answerValue, inputButton.dataset.nextUrl)
    })
}

if (multipleChoiceButton){
    multipleChoiceButton.addEventListener("click", function(event) {
        let answerArray = []
        let answerValue = ""
        let correctArray = []
        let correctAnswer = ""
        let userAnswer = getCookie("userAnswers");

        for (const value of document.querySelectorAll(".active-multiple-answer")){
            answerArray.push(value.id)
        }

        answerArray = answerArray.sort()
        answerValue= answerArray.join("$$$")
        
        if (!answerValue){
            answerValue = "not_answer"
        }

        if (!userAnswer){
            setCookie("userAnswers", answerValue) 
        } else{
            setCookie("userAnswers", `${userAnswer}|${answerValue}`)     
        }

        correctArray = [...correct_answer_list[question_number]].sort()
        correctAnswer = correctArray.join("$$$")

        showResult(correctAnswer === answerValue, multipleChoiceButton.dataset.nextUrl)
    })
}

for (let count = 0; count < multipleChoiceButtons .length; count++) {
    let button= multipleChoiceButtons [count];

    const checkmark = document.createElement("span")
    checkmark.classList.add("checkmark")
    checkmark.textContent = "✓"
    
    button.addEventListener("click" ,function (event) {
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

for (let link of answerLinks) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const nextUrl = link.href;
        const button = link.querySelector(".answer")
        const currentAnswers= getCookie("userAnswers");

        if (!currentAnswers){
            setCookie("userAnswers", button.id) 
        }
        else{
            let userAnswer = getCookie("userAnswers");
            setCookie("userAnswers", `${userAnswer}|${button.id}`) 
        }  
        
        showResult(correct_answer_list[question_number] === button.id, nextUrl)
    })
}
