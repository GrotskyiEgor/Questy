let donatChart;
let reorderTimeout = null;


function safeReorder() {
    clearTimeout(reorderTimeout);

    reorderTimeout = setTimeout(() => {
        reorderUserBar();
    }, 10);
};


function reorderUserBar() {
    const container = document.querySelector('.all-users-bar');
    const blocks = Array.from(container.children);

    // чистим мусор
    answeredOrder = answeredOrder.filter(user => 
        document.getElementById(`answerUser${user}`)
    );

    const positions = new Map();

    blocks.forEach(el => {
        el.style.transition = "none";
        el.style.transform = "";
        positions.set(el, el.getBoundingClientRect().top);
    });

    blocks.sort((a, b) => {
        const userA = a.id.replace("answerUser", "");
        const userB = b.id.replace("answerUser", "");

        const indexA = answeredOrder.indexOf(userA);
        const indexB = answeredOrder.indexOf(userB);

        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });

    blocks.forEach(el => container.appendChild(el));

    // АНИМАЦИЯ
    blocks.forEach(el => {
        const oldTop = positions.get(el);
        const newTop = el.getBoundingClientRect().top;

        const delta = oldTop - newTop;

        el.style.transform = `translateY(${delta}px)`;

        requestAnimationFrame(() => {
            el.style.transition = "transform 0.4s ease";
            el.style.transform = "";
        });
    });

    // обновление номеров
    blocks.forEach((block, index) => {
        const circleText = block.querySelector('.circle-text');
        if (circleText) {
            circleText.childNodes[0].textContent = (index + 1);
        }
    });

    console.log("answeredOrder", answeredOrder)
}


function kickFromTest(kick_user){
    let UserList= getCookie("userList") || "";
    let users = UserList.split("</>").filter(username => username.trim() !== "");

    users = users.filter(userStr => {
        const [name, userIp] = userStr.split("()")
        return name !== kick_user
    })

    const newUserList = users.join("</>")

    setCookie("userList", newUserList)

    socket.emit("kick_user", {
        room: room,
        user: kick_user
    });

    let removeUserBlock= document.getElementById(`answerUser${kick_user}`)

    if (removeUserBlock) {
        removeUserBlock.remove()
    }
}

function checkDoughnutChart(){
    countUsersAnswer = getCookie("countUsersAnswer");
    correctAnswerChart = getCookie("countCorrectAnswer");
    
    if (lengthArrey === Number(countUsersAnswer)){
        timerStop();

        const answerDiv = document.createElement("div")
        answerDiv.className = "chart-answer-count"

        const worstCount = document.createElement("p")
        const rightCount = document.createElement("p")
        rightCount.textContent = `Правильних відповідей: ${correctAnswerChart}`
        worstCount.textContent = `Неправильних відповідей: ${lengthArrey - Number(correctAnswerChart)}`

        answerDiv.appendChild(rightCount)
        answerDiv.appendChild(worstCount)
        const chartDiv = document.querySelector(".chart-div")
        chartDiv.appendChild(answerDiv)

        renderDoughnutChart("donat-chart", lengthArrey, correctAnswerChart);
    }
}

function addUserAnswer(username, answer, authorname, quiz) {
    const userAnswers = document.getElementById("user-answers");
    const countAnswerSpan  = document.getElementById("count-answer-span");
    let correctAnswer= quiz.correct_answer.split("%$№").sort();
    let answerClassStatus = "user-answer-worst";
    let correct = false;

    countAnswerSpan.textContent= `${parseInt(countAnswerSpan.textContent) + 1}`;
    if (answer.includes("$$$")){
        userAnswer = answer.split("$$$").sort()
        if (userAnswer.join(",") == correctAnswer.join(",")){
            answerClassStatus = "user-answer-correct";
            countCorrect= parseInt(getCookie("countCorrectAnswer")) + 1;
            correct = true;
            setCookie("countCorrectAnswer", countCorrect);
        }
    } else {
        if (answer == correctAnswer){
            countCorrect = parseInt(getCookie("countCorrectAnswer")) + 1;
            correct = true;
            answerClassStatus = "user-answer-correct";
            setCookie("countCorrectAnswer", countCorrect);
        }
    }

    if (quiz.question_type){
        answer = answer.replaceAll("$$$", " та ")
    }

    userAnswers.innerHTML += `
        <div class="${answerClassStatus}">
            <div class="user-name">${username}</div>
            <div class="answer-text">
                <p>${answer}</p>
                <p>Витрачено часу на відповідь: ${parseInt(quiz.time)- parseInt(getCookie('time')) + plusAnswerTime} сек.</p>
            </div>
        </div>
    `

    const userBarBlock = document.getElementById(`answerUser${username}`)

    if (userBarBlock){
        const userBarText = userBarBlock.querySelector('.bar-user-checkbox')
        userBarText.textContent = '✓'

        const userCircle = userBarBlock.querySelector(".circle")
        if (correct){
            userCircle.classList.remove("no-answer")
            userCircle.classList.add("correct")
        } else {
            userCircle.classList.remove("no-answer")
            userCircle.classList.add("wrong")
        }
    }

    socket.emit('get_usernames', {
        room: room,
        author_name: authorname
    });

    if (!answeredOrder.includes(username)) {
        answeredOrder.push(username);
    }

    safeReorder();

    reorderUserBar();
    checkDoughnutChart()
}

function createUsersBar(usesArray){
    const allUsersArrayBar = document.querySelector('.all-users-bar')

    allUsersArrayBar.innerHTML = ''

    if (usesArray){
        usesArray.forEach((username, index) => {           
            const userBlock = document.createElement('div')
            userBlock.className = 'bar-user-block'
            userBlock.id = `answerUser${username}`

            const leftUserBlock = document.createElement('div')
            leftUserBlock.className = 'bar-left-user-block'

            const userBlockUsername = document.createElement('div')
            userBlockUsername.className = 'bar-username-block'
            userBlockUsername.textContent = username.length > 12 ? username.slice(0, 9) + "..." : username;

            const userBlockCheckBox = document.createElement('div')
            userBlockCheckBox.className = 'bar-user-checkbox'

            const btnKick = document.createElement("button");
            btnKick.className = "btn-remove-bar";
            btnKick.type = "button";
            btnKick.textContent = "Видалити"
            
            btnKick.onclick = function () {
                kickFromTest(username)
            };

            if (allUsersArrayBar){
                leftUserBlock.innerHTML += `<span class="circle-text">${index + 1}<span class="circle no-answer"></span></span>`
                leftUserBlock.appendChild(userBlockUsername);
                leftUserBlock.appendChild(userBlockCheckBox);
                userBlock.appendChild(leftUserBlock);
                userBlock.appendChild(btnKick);
                allUsersArrayBar.appendChild(userBlock)
            };
        });
    }
}

function renderAuthorStart(quiz, room, authorname, number_of_question, totalQuestion, questionNumber) {
    setMusicTheme("onlineRoomTheme");

    const answerCounter = document.querySelector(".chart-answer-count");
    if (answerCounter) answerCounter.remove();

    const donatChart = document.getElementById("donat-chart");
    if (donatChart) donatChart.remove();

    const waitContent = document.getElementById("room-content");
    waitContent.innerHTML = ""; 
    waitContent.id = 'container-question';
    waitContent.className = 'container-question';

    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block-test';

    const allUsersArrayBar = document.createElement('div');
    allUsersArrayBar.className = 'all-users-bar';

    const headerBar = document.createElement('div');
    headerBar.className = 'header-bar';

    const questionTable= document.createElement('table');
    questionTable.className= 'question-table';

    const headerRow= document.createElement('tr');
    const questionHeader= document.createElement('th');
    questionHeader.id= "question-title";
    questionHeader.textContent= `Питання: ${questionNumber + 1} з ${totalQuestion}`;
    const answerHeader= document.createElement('th');
    answerHeader.textContent= "Правильна відповідь:";

    headerRow.appendChild(questionHeader);
    headerRow.appendChild(answerHeader);

    const infoRow= document.createElement('tr');
    const questionInfo= document.createElement('td');
    questionInfo.id= 'author-question';
    questionInfo.className= 'author-question';
    questionInfo.textContent= quiz.question_text;

    const correctTd = document.createElement('td');
    correctTd.className = 'correct-line';

    const correctAnswer= document.createElement('span');
    correctAnswer.id= 'author-correct-answer';
    correctAnswer.className= 'author-correct-answer';
    correctAnswer.style.display= "none";

    if (quiz.question_type === "multiple_choice"){
        correctAnswer.textContent= `${quiz.correct_answer.replaceAll("%$№", " та ")}`;
    }
    else{
        correctAnswer.textContent= `${quiz.correct_answer}`;
    };

    const eyeIcon= document.createElement('i');
    eyeIcon.id = 'eye-icon';
    eyeIcon.className= 'bx bx-hide toggle-icon';

    eyeIcon.addEventListener('click', () => {
        if (correctAnswer.style.display === 'none'){
            correctAnswer.style.display = 'table-cell';
            eyeIcon.classList.replace('bx-hide', 'bx-show');
        }
        else{
            correctAnswer.style.display = 'none'
            eyeIcon.classList.replace('bx-show', 'bx-hide');
        };
    });

    infoRow.appendChild(questionInfo);
    correctTd.appendChild(correctAnswer);
    correctTd.appendChild(eyeIcon);
    infoRow.appendChild(correctTd);

    questionTable.appendChild(headerRow);
    questionTable.appendChild(infoRow);
    
    questionBlock.appendChild(questionTable);

    const userBlock = document.createElement('div');
    userBlock.id = 'user-block';
    userBlock.className = 'user-blocks';

    const userAnswers = document.createElement('div');
    userAnswers.id = 'user-answers';
    userAnswers.className = 'user-answers';
 
    userBlock.appendChild(userAnswers);
    
    const userInfo = document.createElement('div');
    userInfo.id = 'user-info';
    userInfo.className = 'user-info';

    const studInfoBox = document.createElement('div');
    studInfoBox.id = 'stud-info-box';
    studInfoBox.className = 'stud-info-box';

    const chartDiv = document.createElement('div');
    chartDiv.id = 'chart-div';
    chartDiv.className = 'chart-div';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'donat-chart';
    chartCanvas.className = 'donat-chart';

    chartDiv.appendChild(chartCanvas);
    userInfo.appendChild(chartDiv);
    userInfo.appendChild(studInfoBox);

    userBlock.appendChild(userInfo);

    questionBlock.appendChild(userBlock);
    waitContent.appendChild(questionBlock);
    waitContent.appendChild(allUsersArrayBar);

    socket.emit('get_usernames', {
        room: room,
        author_name: authorname
    });

    let quizTime = Number(getCookie("time"));

    socket.once('get_usernames', function(data){
        let userArrey = data;
        let nextButton = '';
        lengthArrey = userArrey.length;

        if (number_of_question === totalQuestion- 1){
            nextButton= `
                <button id="next-q" class="next-q" onclick="testStop()" data-tooltip="Кінець тесту">
                    <img src="test_app/static/images/online_test/next.png" class="online-img" alt="next-btn">
                </button>
                `
        }
        else{
            nextButton= `
                <button id="next-q" class="next-q" onclick="nextQuestion()" data-tooltip="Наступне питання">
                    <img src="test_app/static/images/online_test/next.png" class="online-img" alt="next-btn">
                </button>
                `
        };

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
                <p id="timer">${quizTime}</p>
                <button onclick="plusTime()" class="timer-btn" data-tooltip="Додати час">
                    <img src="test_app/static/images/online_test/plus.png" class="online-small-img" alt="plus-btn">
                </button>
                <button onclick="stopTime()" id="play-btn" class="timer-btn" data-tooltip="Почати">
                    <img src="test_app/static/images/online_test/pause.png" class="online-img" id="play-img" alt="play-btn">
                </button>
            </div>
            `;

        checkDoughnutChart();
        createUsersBar(data);
        startTimer();
    });
}
