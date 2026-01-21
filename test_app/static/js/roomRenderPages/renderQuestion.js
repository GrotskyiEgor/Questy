function tokenTimePrecent(userTimer, allTime){
    let timePrecent= (userTimer/ allTime)
    let max_token= 1200
    let token= 0
    let constant= 2

    token= Math.round(max_token * Math.exp(-timePrecent * constant))
    return token
}

function renderWaitQuestion(type) {
    const roomContent = document.getElementById("room-content");

    roomContent.innerHTML = ""; 
    roomContent.className = 'wait-next-question'

    let leaveButton= ""
    let textWaitQuestion= "Будь ласка, зачекайте, поки інші учасники відповідають..."
    if (type === "wait"){
        leaveButton= `<button class='leave-test' onclick="leaveTest()">Відключитися від тесту</button>`
    } else if (type === "start"){
        textWaitQuestion= "Зачекайте, поки організатор прийме вас до тесту"
        leaveButton= `<button class='leave-test' onclick="leaveTest()">Відключитися від тесту</button>`
    } else if (type === "reconnect"){
        setCookie("reconnect", "1")
        textWaitQuestion= 'Тест завершено, ваш результат не буде зараховано'
        leaveButton= `<button class='leave-test' onclick="userLeaveTest()">Відключитися від тесту</button>`
    }
    roomContent.innerHTML = `
        <div class="blur-overlay">
            <div class="wait-content">
                <div class="waiting-message">
                    ${textWaitQuestion}
                    ${leaveButton}
                </div>
            </div>
        </div>
    `
}

function renderQuestion(testId, quiz, answers, room, author_name) {
    let state= getCookie("state")
    let quizTime= getCookie("time");
    let userTimer= 0
    let curTime= 0
    let token= 0
    const roomContent= document.getElementById("room-content");

    if (isNaN(quizTime) || quizTime < 0){
        renderWaitQuestion("test")
    }

    if (roomContent != null) {
        roomContent.className= "question-content";
        roomContent.innerHTML= ""; 
    };

    const questionBlock= document.createElement("div");
    questionBlock.className= "question";

    const question= document.createElement("p");
    question.textContent= quiz.question_text;
    questionBlock.appendChild(question);

    const timer = document.createElement("p");
    timer.id= "timer"
    timer.textContent= quizTime;
    questionBlock.appendChild(timer);
 
    const answersDiv= document.createElement("div");
    
    if (quiz.question_type === "input"){
        answersDiv.className= "answers-input";
    }
    else{
        answersDiv.className= "answers";
    }

    if (quiz.question_type === "choice" || quiz.question_type === "image"){
        answers.forEach(answer => {
            const link = document.createElement("button");
            link.className= "passing-answer";
            link.id= `${answer}`;

            const answerDiv= document.createElement("div");
            answerDiv.className= "answer-div";
            answerDiv.id= answer;
            answerDiv.textContent= answer;

            link.appendChild(answerDiv);
            answersDiv.appendChild(link);
        });

        if (roomContent != null ) { 
            roomContent.appendChild(questionBlock);

            if (quiz.question_type === "image"){
                const imageDiv = document.createElement("div");
                imageDiv.className= "image-div";

                const image = document.createElement("img");
                image.src = `/test_app/static/images/${testId}/${quiz.image_name}`;
                image.alt= "quiz image";

                imageDiv.appendChild(image)
                roomContent.appendChild(imageDiv)
            }
            
            roomContent.appendChild(answersDiv);
        }

        const buttonsArrey = document.querySelectorAll(".passing-answer")

        for (let count = 0; count < buttonsArrey.length; count++ ) {
            let button= buttonsArrey[count];
            button.addEventListener(
                type= "click" ,
                listener= function (event) {
                    let cookie= getCookie("userAnswers")
                    let userTimers= getCookie("userTimers")
                    let userTokens= getCookie("userTokens")

                    curTime= getCookie("time");
                    allTime= plusAnswerTime+ quizList[Number(state.replace(/\D/g, ""))].time
                    userTimer= allTime- curTime
                    token= tokenTimePrecent(userTimer, allTime)

                    setCookie("state", `wait${state.replace(/\D/g, "")}`)
                    
                    if (typeof cookie === "undefined"){
                        setCookie("userAnswers", `|${button.id}|`)
                        setCookie("userTimers", userTimer)
                        setCookie("userTokens", token)
                    }
                    else{
                        cookie= cookie+ `|${button.id}|`
                        newUserTimers= userTimers+ `|${userTimer}`
                        newUserTokens= userTokens+ `|${token}`
                        setCookie("userAnswers", cookie)
                        setCookie("userTimers", newUserTimers)
                        setCookie("userTokens", newUserTokens)
                    }   

                    renderWaitQuestion("test");
                    
                    socket.emit(SOKET_USER_ANSWERS, {
                        room: room,
                        author_name: author_name,
                        username: username,
                        answer: button.id
                    });
                }
            )
        }
    }
    else if (quiz.question_type === "input"){        
        const inputAnswer = document.createElement("input");
        inputAnswer.placeholder = "Введіть відповідь на запитання";
        inputAnswer.type = "text";
        inputAnswer.className = "input-with-answer";

        const inputButton = document.createElement("button");
        inputButton.className= "multiple-choice-answer"
        inputButton.textContent= "Відповісти на питання"

        answersDiv.appendChild(inputAnswer)

        if (roomContent != null ) {
            roomContent.appendChild(questionBlock);
            roomContent.appendChild(answersDiv);
            roomContent.appendChild(inputButton);
        }
        
        inputButton.addEventListener("click", function(event) {
            let userAnswer= getCookie("userAnswers")
            let userTimers= getCookie("userTimers")
            let userTokens= getCookie("userTokens")    
            let answerValue= document.querySelector(".input-with-answer").value.trim()

            curTime= getCookie("time");
            allTime= plusAnswerTime+ quizList[Number(state.replace(/\D/g, ""))].time
            userTimer= allTime- curTime
            token= tokenTimePrecent(userTimer, allTime)

            setCookie("state", `wait${state.replace(/\D/g, "")}`)
            newUserTokens= userTokens+ `|${token}`
            newUserTimers= userTimers+ `|${userTimer}`

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
                if (typeof userAnswer === "undefined"){
                    setCookie("userTimers", userTimer)
                    setCookie("userTokens", token)
                }
                else{
                    setCookie("userTimers", newUserTimers)
                    setCookie("userTokens", newUserTokens)
                } 
            }
            
            if (typeof userAnswer === "undefined"){
                setCookie("userAnswers", `|${answerValue}|`)
                setCookie("userTokens", token)
            }
            else{
                cookie= userAnswer + `|${answerValue}|`            
                setCookie("userAnswers", cookie)
                setCookie("userTokens", newUserTokens)
                setCookie("userTimers", newUserTimers)
            }       

            renderWaitQuestion("test");
                    
            socket.emit(SOKET_USER_ANSWERS, {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    
    }
    else if (quiz.question_type === "multiple_choice"){
        answers.forEach(answer => {
            const answerDiv = document.createElement("div");
            answerDiv.className = "multiple-div";

            const answerButton = document.createElement("button");
            answerButton.className = "multiple-answer";
            answerButton.id = answer;

            const textNode = document.createTextNode(answer);
            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            checkmark.textContent = "✔";

            answerButton.appendChild(textNode)
            answerButton.appendChild(checkmark)

            answerDiv.appendChild(answerButton);
            answersDiv.appendChild(answerDiv);
        });

        const answerButton = document.createElement("button");
        answerButton.className = "multiple-choice-answer";
        answerButton.textContent = "Відповісти на запитання";

        if (roomContent != null ) { 
            roomContent.appendChild(questionBlock);
            roomContent.appendChild(answersDiv);
            roomContent.appendChild(answerButton);
        }

        const multipleChoiceButton = document.querySelector(".multiple-choice-answer")
        const multipleChoiceButtons = document.querySelectorAll(".multiple-answer")

        for (let count = 0; count < multipleChoiceButtons .length; count++ ) {
            let button= multipleChoiceButtons [count];
            
            button.addEventListener(
                type= "click" ,
                listener= function (event) {
                    if (button.className === "multiple-answer"){
                        button.className= "active-multiple-answer"
                    }
                    else{
                        button.className= "multiple-answer"
                    }
                }
            )
        }

        multipleChoiceButton.addEventListener("click", function(event) {
            curTime= getCookie("time");
            let state= getCookie("state")
            let userAnswer= getCookie("userAnswers")
            let userTimers= getCookie("userTimers")
            let userTokens= getCookie("userTokens")                  
            let answerValue= ""
            let arreyUserMultipleChoice= document.querySelectorAll(".active-multiple-answer")
            allTime= plusAnswerTime+ quizList[Number(state.replace(/\D/g, ""))].time
            userTimer= allTime- curTime
            token= tokenTimePrecent(userTimer, allTime)

            newUserTokens= userTokens+ `|${token}`
            newUserTimers= userTimers+ `|${userTimer}`

            for (const button of arreyUserMultipleChoice){
                if (!answerValue){
                    answerValue += button.id
                }
                else{
                    answerValue += "$$$" + button.id
                }
            }

            setCookie("state", `wait${state.replace(/\D/g, "")}`)

            if (typeof answerValue === "undefined"){
                answerValue= "not_answer"
                if (typeof userAnswer === "undefined"){
                    setCookie("userTimers", userTimer)
                    setCookie("userTokens", token)
                }
                else{
                    setCookie("userTimers", newUserTimers)
                    setCookie("userTokens", newUserTokens)
                } 
            }
            
            if (typeof userAnswer === "undefined"){
                setCookie("userAnswers", answerValue)
                setCookie("userTimers", userTimer)
                setCookie("userTokens", token)
            }
            else{
                cookie= userAnswer + `|${answerValue}|`
                setCookie("userAnswers", cookie)
                setCookie("userTokens", newUserTokens)
                setCookie("userTimers", newUserTimers)
            }       

            renderWaitQuestion("test");
                    
            socket.emit(SOKET_USER_ANSWERS, {
                room: room,
                author_name: author_name,
                username: username,
                answer: answerValue
            });
        })
    }

    startTimer()
}
