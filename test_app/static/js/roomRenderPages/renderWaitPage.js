function renderRoomMain(testCode, authorName, username, quizzes, userListName) {
    const content = document.getElementById("room-content");
    content.innerHTML = "";

    const container = document.createElement("div");
    container.className = "room-container";
    
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

    const textAuthor = document.createElement("div");
    textAuthor.className = "info-text";
    textAuthor.textContent = `Автор: ${authorName}`;

    const textCode = document.createElement("div");
    textCode.className = "info-text";
    textCode.innerHTML = `Код тесту:<strong>${testCode}</strong>`;

    infoBar.appendChild(textAuthor);
    infoBar.appendChild(textCode);
    waitSideTop.appendChild(infoBar);

    let durationSeconds= 0
    quizzes.forEach(quiz => {
        durationSeconds += Number(quiz.time) + 15
    });

    let duration= durationSeconds / 60
    let durationFix= duration.toFixed(2)

    // Інформація про тест
    const testInfo = document.createElement("div");
    testInfo.className = "test-info-box";
    testInfo.innerHTML = `
        <h3>Інформація про тест</h3>
        <ul>
            <li>Кількість запитань: ${quizzes.length}</li>
            <li>Тривалість: ${durationFix} хвилин</li>
        </ul>
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
                <div class="user-name">Учні ще не приєдналися. Очікуємо...</div>
            </div>
        `;
    }else {
        userList.innerHTML = `
            <div class="user-block teacher-block">
                <div class="user-name"><strong>Вчитель:</strong> ${authorName}</div>
            </div>`
    }
    const info1 = document.createElement("div");
    info1.className = "info-user";

    const userListText = document.createElement("h3");
    userListText.className= "user-list-title"
    userListText.textContent = "Список учасників:";
    
    info1.appendChild(userListText)
    allUsers.appendChild(info1);
    allUsers.appendChild(userList);

    if (authorName === username) {

        const info2 = document.createElement("div");
        info2.className = "info-user";

        const waitUsers = document.createElement("div");
        waitUsers.id = "wait-users";
        waitUsers.className = "wait-users";

        
        const waitUsersText = document.createElement("h3");
        waitUsersText.className= "user-list-title"
        waitUsersText.textContent = "Зал очікування:";
        info2.appendChild(waitUsersText)

        allUsers.appendChild(info2);
        allUsers.appendChild(waitUsers);
    }

    waitSideTop.appendChild(allUsers);

    let waitSideBottom;
    // Кнопка "Почати" для автора
    waitSideBottom = document.createElement("div");
    waitSideBottom.className = "wait-side-bottom";
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
        leaveButton.addEventListener("click", leaveTestBlock);
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
        waitSide.appendChild(waitSideBottom)
    }

    container.appendChild(waitSide);
    container.appendChild(chat);
    content.appendChild(container);

    // Кількість учасників
    const participantsBox = document.createElement("div");
    participantsBox.className = "participants-box";

    const participantsTitle = document.createElement("h3");
    participantsTitle.textContent = "Кількість учасників";
    participantsBox.appendChild(participantsTitle);

    if (userListName){
        let userListBlocks= userListName.split("</>")
        userListBlocks.forEach(block => {
            createUserBlock(username, authorName, block.split("()")[0], 0, "not");
        })
    }

    $('#msg').on('keydown', function(event){
        if (event.key === "Enter"){
            event.preventDefault()
            $('.send-btn').click()
        }
    })
}
