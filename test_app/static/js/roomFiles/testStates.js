function testStop(){    
    socket.emit(SOKET_STOP_TEST, {
        room: room,
        author_name: authorName
    });

    setCookie("state", "authorResultTest")
    renderAuthorResultTest(username, authorName, totalQuestion);
}

function authorStartTest() {
    let userList= getCookie("userList")
    if (userList){
        socket.emit("SOKET_AUTHOR_START_TEST", {
            room: room,
        });
    }
}

function nextQuestion(){
    const nextButton = document.getElementById("next-q");

    state = getCookie("state");
    let numberOfQuestion= Number(state.replace(/\D/g, "")) + 1;
    
    setCookie("timeStop", "false") 

    const userAnswers = document.getElementById("user-answers");
    userAnswers.innerHTML = ""

    const countAnswer = document.getElementById("count-answer-span");
    countAnswer.textContent= 0;
    
    setCookie("state", `${COOKIE_AUTHOR_START}${numberOfQuestion}`)
    setCookie("countCorrectAnswer", 0)

    if (numberOfQuestion === totalQuestion- 1) {
        nextButton.textContent = 'Кінець тесту'
        nextButton.removeEventListener("click", nextQuestion)
        nextButton.addEventListener("click", testStop);
    }
    
    if (donatChart){
        donatChart.destroy()
    }

    if (!quizList[numberOfQuestion]){
        return
    }

    setCookie("countUsersAnswer", 0)

    const questionTitle = document.getElementById("question-title")
    questionTitle.textContent = `Питання: ${numberOfQuestion + 1} з ${totalQuestion}`
    
    const questionText = document.getElementById("author-question")
    questionText.textContent = `${quizList[numberOfQuestion].question_text}`

    const correctAnswer = document.getElementById("author-correct-answer")

    if (quizList[numberOfQuestion].question_type === "multiple_choice"){
        correctAnswer.textContent= `${quizList[numberOfQuestion].correct_answer.replaceAll("%$№", " та ")}`
    }
    else{
        correctAnswer.textContent= `${quizList[numberOfQuestion].correct_answer}`
    }

    setCookie("time", Number(quizList[numberOfQuestion].time))
    resetTimer(Number(quizList[numberOfQuestion].time))

    const newTime = document.getElementById("timer")
    newTime.textContent =`${quizList[numberOfQuestion].time}`

    timerPaused= false
    plusAnswerTime= 0
    
    socket.emit(SOKET_NEXT_QUESTION, {
        room: room,
        author_name: authorName
    });
}

function checkAnswers(type){
    state = getCookie("state");
    let token= 0
    const questionIndex= Number(state.replace(/\D/g, ""))

    let answers = getCookie("userAnswers") || ""
    let userTimers= getCookie("userTimers") || ""
    let userTokens= getCookie("userTokens") || ""

    const curTime= Number(getCookie("time")) || 0
    const allTime= plusAnswerTime+ quizList[Number(state.replace(/\D/g, ""))].time
    const userTimer= allTime -curTime
    
    let answerList= answers.split("|")
    answerList= answerList.filter(answer => answer && answer !== " ")
    let missingCount= 1+ questionIndex- answerList.length

    if (missingCount < 0){
        return
    } else if (missingCount === 0 && answerList.length === 0){
        missingCount= 1
    }

    if (type === "test"){
        for (let miss = 0; miss < missingCount; miss++) {
            answers += "|not_answer|";
            if (userTimers === "" && userTokens === ""){
                userTimers += `${userTimer}`;
                userTokens += `${token}`;
            } else{
                userTimers += `|${userTimer}`;
                userTokens += `|${token}`;
            }
        }
    } else if (type === "reconnect"){
        for (let miss = 0; miss < missingCount- 1; miss++) {
            answers += "|not_answer|";
            if (userTimers === "" && userTokens === ""){
                userTimers += `0`;
                userTokens += `0`;
            } else{
                userTimers += `|0`;
                userTokens += `|0`;
            }
        }
    }

    setCookie("userAnswers", answers)
    setCookie("userTimers", userTimers)
    setCookie("userTokens", userTokens)
}

function sendMessage() {
    let msgInput = document.getElementById("msg");
    let messages = document.getElementById("messages");
    let message = msgInput.value;

    if (message != ""){
        let messages = document.getElementById("messages");

        messages.innerHTML += `<p class="my-msg">${username}: ${msgInput.value}</p>`;  

        if (messages && messages.children.length != 1){
            const emptyMessages= document.getElementById("no-messages");
            if (emptyMessages){
                emptyMessages.remove()
            }
        }

        socket.emit(SOKET_MESSAGE_TO_CHAT, {
            message: message,
            room: room,         
            username: username  
        });
    }
    msgInput.value = "";
}