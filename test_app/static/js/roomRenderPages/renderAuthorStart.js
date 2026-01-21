let donatChart;

function addUserAnswer(username, answer, authorname, quiz) {
    const userAnswers = document.getElementById("user-answers");
    const countAnswerSpan  = document.getElementById("count-answer-span");
    let correctAnswer= quiz.correct_answer.split("%$№").sort();

    countAnswerSpan.textContent= `${parseInt(countAnswerSpan.textContent) + 1}`;

    if (answer.includes("$$$")){
        userAnswer= answer.split("$$$").sort()
        if (userAnswer.join(",") == correctAnswer.join(",")){
            countCorrect= parseInt(getCookie("countCorrectAnswer"))+ 1
            setCookie("countCorrectAnswer", countCorrect)
        }
    } else {
        if (answer == correctAnswer){
            countCorrect= parseInt(getCookie("countCorrectAnswer"))+ 1
            setCookie("countCorrectAnswer", countCorrect)
        }
    }

    if (quiz.question_type){
        answer= answer.replace("$$$", " та ")
    }

    userAnswers.innerHTML += `
        <div class="user-answer">
            <div class="user-name">${username}</div>
            <div class="answer-text">
                <p>${answer}</p>
                <p>Витрачено часу на відповідь: ${parseInt(quiz.time)- parseInt(getCookie('time')) + plusAnswerTime} сек.</p>
            </div>
        </div>
    `

    socket.emit(SOKET_GET_USERNAMES, {
        room: room,
        author_name: authorname
    });

    socket.once(SOKEN_GET_USERNAMES, function(data){
        let userArrey= data;
        lengthArrey= userArrey.length

        countUsersAnswer= getCookie("countUsersAnswer")
        correctAnswerChart= getCookie("countCorrectAnswer")
        
        if (lengthArrey === Number(countUsersAnswer)){
            renderDoughnutChart("donat-chart", lengthArrey, correctAnswerChart)
        }
    })
}

function renderAuthorStart(quiz, room, authorname, number_of_question, totalQuestion, questionNumber) {
    const waitContent = document.getElementById("room-content");
    waitContent.innerHTML = ""; 
    waitContent.id = 'container-question'
    waitContent.className = 'container-question'

    const headerBar = document.createElement('div')
    headerBar.className = 'header-bar'

    const questionTable= document.createElement('table')
    questionTable.className= 'question-table'

    const headerRow= document.createElement('tr')
    const questionHeader= document.createElement('th')
    questionHeader.id= "question-title"
    questionHeader.textContent= `Питання: ${questionNumber + 1} з ${totalQuestion}`
    const answerHeader= document.createElement('th')
    answerHeader.textContent= "Правильна відповідь:"

    headerRow.appendChild(questionHeader)
    headerRow.appendChild(answerHeader)

    const infoRow= document.createElement('tr')
    const questionInfo= document.createElement('td')
    questionInfo.id= 'author-question'
    questionInfo.className= 'author-question'
    questionInfo.textContent= quiz.question_text

    const correctTd = document.createElement('td')
    correctTd.className = 'correct-line'

    const correctAnswer= document.createElement('span')
    correctAnswer.id= 'author-correct-answer'
    correctAnswer.className= 'author-correct-answer'
    correctAnswer.style.display= "none"

    if (quiz.question_type === "multiple_choice"){
        correctAnswer.textContent= `${quiz.correct_answer.replaceAll("%$№", " та ")}`
    }
    else{
        correctAnswer.textContent= `${quiz.correct_answer}`
    }

    const eyeIcon= document.createElement('i')
    eyeIcon.id = 'eye-icon'
    eyeIcon.className= 'bx bx-hide toggle-icon'

    eyeIcon.addEventListener('click', () => {
        if (correctAnswer.style.display === 'none'){
            correctAnswer.style.display = 'table-cell'
            eyeIcon.classList.replace('bx-hide', 'bx-show')
        }
        else{
            correctAnswer.style.display = 'none'
            eyeIcon.classList.replace('bx-show', 'bx-hide')
        }
    })

    infoRow.appendChild(questionInfo)
    correctTd.appendChild(correctAnswer)
    correctTd.appendChild(eyeIcon)
    infoRow.appendChild(correctTd)

    questionTable.appendChild(headerRow)
    questionTable.appendChild(infoRow)
    headerBar.appendChild(questionTable)
    
    waitContent.appendChild(headerBar)

    const userBlock = document.createElement('div')
    userBlock.id = 'user-block'
    userBlock.className = 'user-blocks'

    const userAnswers = document.createElement('div')
    userAnswers.id = 'user-answers'
    userAnswers.className = 'user-answers'
 
    userBlock.appendChild(userAnswers)
    
    const userInfo = document.createElement('div')
    userInfo.id = 'user-info'
    userInfo.className = 'user-info'

    const studInfoBox = document.createElement('div')
    studInfoBox.id = 'stud-info-box'
    studInfoBox.className = 'stud-info-box'

    const chartDiv = document.createElement('div')
    chartDiv.id = 'chart-div'
    chartDiv.className = 'chart-div'

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'donat-chart'
    chartCanvas.className = 'donat-chart'

    userInfo.appendChild(studInfoBox)

    chartDiv.appendChild(chartCanvas)
    userInfo.appendChild(chartDiv)

    userBlock.appendChild(userInfo)

    waitContent.appendChild(userBlock)

    socket.emit(SOKET_GET_USERNAMES, {
        room: room,
        author_name: authorname
    });

    let quizTime= getCookie("time");

    socket.once(SOKEN_GET_USERNAMES, function(data){
        let userArrey = data;
        let nextButton= '';
        lengthArrey = userArrey.length

        if (number_of_question === totalQuestion- 1){
            nextButton= `<button id="next-q" class="next-q" onclick="testStop()">Кінець тесту</button>`
        }
        else{
            nextButton= `<button id="next-q" class="next-q" onclick="nextQuestion()">Наступне питання</button>`
        }
        studInfoBox.innerHTML = `
            <div class= "test-nav-info"> 
                <h3>Інформація для вчителя</h3>
                <ul>
                    <li>Всього учнів: <strong></strong>${lengthArrey}</li>
                    <li>Відповіли: <strong><span id="count-answer-span">0</span></strong></li>
                </ul>
            </div>
            <div class="test-nav-btn"> 
                ${nextButton}
                <div class="test-time-btn"> 
                    <button onclick="plusTime()" class="timer-btn">Плюс +15сек.</button>
                    <button onclick="stopTime()" id="play-btn" class="timer-btn">Зупинити</button>
                    <p id="timer">${quizTime}</p>
                </div>
            </div>
            `

        startTimer()
    });
}
