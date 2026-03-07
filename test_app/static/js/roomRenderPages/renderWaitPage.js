function setRoomChanges(testCode, type, value){
    const csrfToken = $('#csrf_token').val(); 

    $.ajax ({
        url: `/home/room/${testCode}`,
        method: "POST",
        contentType: "application/json",
        dataType: "json",
        headers: {
            "X-CSRFToken": csrfToken
        },
        data: JSON.stringify({
            ajax: true,                  
            value: value,
            type: type
        }),
        // success: function (data) {
        //     console.log("false")   
        // },
        error: function(thx) {
            console.log(thx)
        }
    })
}

function renderRoomMain(testCode, authorName, username, quizzes, userListName, testMusic, testShowResult) {
    setMusicTheme("onlineRoomTheme", testMusic);

    const content = document.getElementById("room-content");
    content.innerHTML = "";

    // const container = document.createElement("div");
    // container.className = "room-container";
    
    const waitSideTop = document.createElement("div");
    waitSideTop.className = "wait-side-top";

    const waitSide = document.createElement("div");
    waitSide.className = "wait-side";

    // Заголовок
    const roomTitle = document.createElement("h2");
    roomTitle.className = "wait-title";
    roomTitle.textContent = "Кімната очікування";
    waitSideTop.appendChild(roomTitle);

    // Інформація про автора та код
    const infoBar = document.createElement("div");
    infoBar.className = "info-bar";

    const infoBarText = document.createElement("div");
    infoBarText.className = "info-bar-text";

    const textAuthor = document.createElement("div");
    textAuthor.className = "info-text";
    textAuthor.textContent = `Автор: ${authorName}`;

    const textCode = document.createElement("div");
    textCode.className = "info-text";
    textCode.innerHTML = `Код тесту: <strong>${testCode}</strong>`;

    infoBarText.appendChild(textAuthor);
    infoBarText.appendChild(textCode);
    infoBar.appendChild(infoBarText);
    waitSideTop.appendChild(infoBar);

    let durationSeconds = 0
    quizzes.forEach(quiz => {
        durationSeconds += Number(quiz.time) + 15
    });

    let duration = Math.round(durationSeconds / 60)
    // let durationFix = duration.toFixed(2)

    // Інформація про тест
    const testInfo = document.createElement("div");
    testInfo.className = "test-info-box";
    testInfo.innerHTML = `
        <div class="">
            <h3>Інформація про тест</h3>
            <ul>
                <li>Кількість запитань: ${quizzes.length}</li>
                <li>Тривалість: ${duration} хвилин</li>
            </ul>
        </div>
        <div class="">
        <div class="radio-button-box">
            <label for="done-after-due-time">Музика під час тестування</label>               
            <input type="checkbox" name="done-after-due-time" class="music" ${testMusic ? "checked" : ""}>
        </div>
        ${authorName === username ? `
            <div class="radio-button-box">
                <label for="done-after-due-time">Показувати результат відповіді на запитання користувачам</label>               
                <input type="checkbox" name="done-after-due-time" class="show-result" ${testShowResult ? "checked" : ""}>
            </div>
        </div> ` : ""}
    `;
    waitSideTop.appendChild(testInfo);

    // Інструкції
    const instructions = document.createElement("div");
    instructions.className = "instructions-box";
    instructions.innerHTML = `
        <h3>Кількість учасників</h3>
        <ol>
            <li>Не оновлюйте сторінку під час тесту</li>
            <li>Не використовуйте сторонні ресурси</li>
            <li>Тест можна пройти лише один раз</li>
        </ol>
    `;

    const allUsers = document.createElement("div");
    allUsers.id = "all-users";
    allUsers.className = "all-users";

    // Список учасників
    const userList = document.createElement("div");
    userList.id = "user-list";
    userList.className = "user-list";

    if (!userListName){
        userList.innerHTML = `
            <div class="user-block teacher-block">
                <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
            </div>
            <div class="user-block empty-block" id="emty-users-list">
                <div class="empty-name">Учні ще не приєдналися. Очікуємо...</div>
            </div>
        `;
    } else {
        userList.innerHTML = `
            <div class="user-block teacher-block">
                <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
            </div>`
    }

    const info1 = document.createElement("div");
    info1.className = "info-user";

    const userListText = document.createElement("h3");
    userListText.className= "user-list-title";
    userListText.textContent = "Список учасників: ";

    const userListCount = document.createElement("span");
    userListCount.className= "user-list-count";
    userListCount.textContent = 0;
    
    userListText.appendChild(userListCount);
    info1.appendChild(userListText);
    info1.appendChild(userList);
    allUsers.appendChild(info1);

    if (authorName === username) {
        const info2 = document.createElement("div");
        info2.className = "info-user";

        const waitUsers = document.createElement("div");
        waitUsers.id = "wait-users";
        waitUsers.className = "wait-users";


        waitUsers.innerHTML = `
            <div class="user-block empty-block" id="emty-users-wait-list">
                <div class="empty-name">Учні ще не приєдналися. Очікуємо...</div>
            </div>
        `;
        
  
        const waitUsersText = document.createElement("h3");
        waitUsersText.className= "user-list-title"
        waitUsersText.textContent = "Зал очікування: ";

        const waitUsersCount = document.createElement("span");
        waitUsersCount.className= "wait-list-count";
        waitUsersCount.textContent = 0;
        
        waitUsersText.appendChild(waitUsersCount);
        info2.appendChild(waitUsersText)

        info2.appendChild(waitUsers);
        allUsers.appendChild(info2);
    }

    waitSideTop.appendChild(allUsers);

    let waitSideBottom;
    // Кнопка "Почати" для автора
    waitSideBottom = document.createElement("div");
    waitSideBottom.className = "test-buttons";
    if (authorName === username) {
        const buttonStart = document.createElement("button");
        buttonStart.type = "button";
        buttonStart.className = "btn-start";
        buttonStart.textContent = "Почати тест";
        buttonStart.addEventListener("click", authorStartTest);
        waitSideBottom.appendChild(buttonStart);

        const buttonEnd = document.createElement("button");
        buttonEnd.type = "button";
        buttonEnd.className = "btn-end";
        buttonEnd.textContent = "Завершити тест";
        buttonEnd.addEventListener("click", () => {
            authorLeaveTest("wait")
        });
        waitSideBottom.appendChild(buttonEnd);
    } else{
        const leaveButton = document.createElement("button");
        leaveButton.type = "button";
        leaveButton.className = "btn-end";
        leaveButton.textContent = "Залишити тест";
        leaveButton.addEventListener("click", () => {leaveTestBlock(testCode, username)});
        waitSideBottom.appendChild(leaveButton);
    }

    // Чат
    const chat = document.createElement("div");
    chat.className = "chat";
    chat.innerHTML = `
        <h2>Чат для спілкування</h2>
        <div id="messages" class="messages">
            <div class="no-messages" id="no-messages">Поки що немає повідомлень...</div>
        </div>

        <input id="msg" class="msg-chat" type="text" placeholder="Введіть повідомлення">
        <button type="button" class="send-btn">Надіслати</button>
    `;

    chat.querySelector(".send-btn").addEventListener("click", sendMessage);

    waitSide.appendChild(waitSideTop)
    if (waitSideBottom) {
        infoBar.appendChild(waitSideBottom)
    }

    const chatToggleBtn = document.createElement("button");
    chatToggleBtn.className = "chat-toggle-btn";
    chatToggleBtn.textContent = "Чат";
    
    chatToggleBtn.addEventListener("click", ()=> {
        const newMessageCount = chatToggleBtn.querySelector(".new-task-count");
        if (newMessageCount){
            newMessageCount.remove()
        }
        chat.classList.toggle("open");
        const waitSide = document.querySelector(".wait-side");

        if (chat.classList.contains("open")){
            waitSide.style.width = "69vw";
        } else {
            waitSide.style.width = "99vw";
        }
    })

    content.appendChild(chatToggleBtn);

    content.appendChild(waitSide);
    content.appendChild(chat);

    // Кількість учасників
    const participantsBox = document.createElement("div");
    participantsBox.className = "participants-box";

    const participantsTitle = document.createElement("h3");
    participantsTitle.textContent = "Кількість учасників";
    participantsBox.appendChild(participantsTitle);

    if (userListName && userListName != true){
        console.log(userListName)
        let userListBlocks = userListName.split("</>")

        userListBlocks.forEach(block => {
            user_data = block.split("()");
            createUserBlock(username, authorName, user_data[0], user_data[1], "not");
        })
    }

    $('#msg').on('keydown', function(event){
        if (event.key === "Enter"){
            event.preventDefault()
            $('.send-btn').click()
        }
    })
    
    document.querySelector(".music").addEventListener('change', function(event) {
        if (this.checked) {
            if (authorName === username){
                setRoomChanges(testCode, "music", true)
            }
            console.log("~1~")
            testMusic = true
            setMusicTheme("onlineRoomTheme", testMusic)        
        } else {
            if (authorName === username){
                setRoomChanges(testCode, "music", false)
            }
            testMusic = false
            console.log("~2~")
            setAllMute()
        }
    })

    if (authorName === username){
        document.querySelector(".show-result").addEventListener('change', function(event) {
            if (this.checked) {
                setRoomChanges(testCode, "show", true)
            } else {
                setRoomChanges(testCode, "show", false)
            }
        })
    }
}
