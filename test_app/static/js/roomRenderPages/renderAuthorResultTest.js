let charts = {};
let selectUserName = null;
let selectBlock = true;


function appendResultRow(resultTable, username, answersArray, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion) {
    const resultRow = document.createElement('div');

    resultRow.className = 'results-row';
    resultRow.id = `row_${username}`;

    resultRow.style.cursor = 'pointer';
    const studentName = document.createElement('div');
    studentName.className = 'cell student-name';
    studentName.textContent = `${username}`;

    let numberCorrectAnswers = 0;
    for (let index= 0; index < answersArray.length; index++) {
        if (answersArray[index] === 1){
            numberCorrectAnswers++;
        };
    };

    let accuracy = (numberCorrectAnswers / totalQuestion) * 100;

    const studentAccuracy = document.createElement('div');
    studentAccuracy.className = 'accuracy';
    studentAccuracy.textContent = `${accuracy.toFixed(1)}%`;

    resultRow.appendChild(studentName);

    answersArray.forEach(correct => {
        const answerBox = document.createElement('div');
        answerBox.className = 'cell';

        const spanBox = document.createElement('span');
        spanBox.className = 'cell';

        switch (correct){
            case 0:
                spanBox.className= 'circle wrong';
                break;
            case 1:
                spanBox.className= 'circle correct';
                break;
            case 2:
                spanBox.className= 'circle no-answer';
                break; 
        };

        answerBox.appendChild(spanBox);
        resultRow.appendChild(answerBox);
    });

    resultRow.appendChild(studentAccuracy);
    resultTable.appendChild(resultRow);

    resultRow.addEventListener('click', function(){
        renderAnalyticsChart('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion, this.id.slice(4), false);
    });
};


function renderAuthorResultTest(username, authorName, totalQuestion, testMusic) {
    setMusicTheme("onlineRoomTheme", testMusic);

    let userCount = 0;
    let userArray = [];
    let resultData = {};

    let accuracyAquestionsArray = [];
    let accurancyArray = [];
    let resultTable = null;
    let tableReady = false;
    let pendingResults = [];

    let container = document.getElementById("container-question");
    
    if (container === null){
        container = document.getElementById("room-content");
    };

    container.innerHTML= "";
    container.className= 'wrapper-author-results-container';

    socket.emit("room_get_result", {
        room: room,
        username: username,
        author_name: authorName
    });
    
    socket.on("room_get_result_data", function(data) {  
        const emptyMsgRemove = document.querySelector('.empty-results');
        if(emptyMsgRemove) emptyMsgRemove.remove();

        const leaveButtonRemove = document.querySelector('.leave-btn');
        if(leaveButtonRemove) leaveButtonRemove.remove();

        resultData = data.room_get_result_data;
        const best_score_data = data.best_score_data;
        const worst_score_data = data.worst_score_data;
        const hardest_question_data = data.hardest_question_data;
        const averega_score = data.averega_score;

        if (Object.keys(resultData).length === 0){
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-results';
            emptyMsg.textContent = 'Поки що немає результатів...';

            // const leaveButton= document.createElement('button');
            // leaveButton.className= 'leave-btn';
            // leaveButton.textContent = 'Покинути тест';
            // leaveButton.addEventListener("click", () => {
            //     authorLeaveTest("test");
            // });

            // container.appendChild(leaveButton);
            container.appendChild(emptyMsg);

            setTimeout(() => {
                socket.emit("room_get_result", {
                    room: room,
                    username: username,
                    author_name: authorName
                });
            }, 1000)

            return;
        }

        let accuracy= questionAccuracy(resultData, totalQuestion);
        accuracyAquestionsArray = accuracy.accuracyAquestionsArray;
        accurancyArray = accuracy.accurancyArray;

        const header = document.createElement('div');
        header.className = 'results-header-block';

        const headerTitle = document.createElement('h1');
        headerTitle.textContent = "Результати тесту";

        header.appendChild(headerTitle);
        container.appendChild(header);

        //
        const buttonBox = document.createElement('div');
        buttonBox.className = 'button-box';
  
        const leftButtonBox = document.createElement('div');
        leftButtonBox.className = 'left-button-box';
        
        const rigthButtonBox = document.createElement('div');
        rigthButtonBox.className = 'right-button-box';

        const leaveButton= document.createElement('button');
        leaveButton.className= 'leave-btn';
        leaveButton.textContent = 'Покинути тест';
        leaveButton.addEventListener("click", () => {
            authorLeaveTest("test");
        });

        const allInfoButton= document.createElement('button');
        allInfoButton.className= 'all-info-btn';
        allInfoButton.textContent = 'Загальна успішність';
        allInfoButton.addEventListener("click", () => {
            chartBoxLable= document.querySelector('.chart-box-label');
            chartBoxLable.textContent = 'Загальна успішність';
            
            selectUserName = null;
            choiceSelector= document.getElementById('choice');

            selectBlock = false;
            choiceSelector.innerHTML= `
                <option value="1">Загальна успішність(%)</option>
                <option value="2">Кількість правильних/неправильних відповідей</option>
                <option value="3">Відсоткове співвідношення правильних відповідей</option>
                <option value="4">Витрачено часу на запитання</option>
                <option value="5">Зароблено монет за питання</option>
            `;
            selectBlock= true;

            renderAccuracyLineChart('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        });

        const form = document.createElement('form');
        form.method = 'POST';

        const exelButton= document.createElement('button');
        exelButton.className= 'exel-btn';
        exelButton.type = "submit";
        exelButton.textContent = 'Завантажити Excel таблицю';
        // exelButton.addEventListener("click", () => excelTable(username, authorName, resultData, best_score_data));    
        form.appendChild(exelButton);
        
        leftButtonBox.appendChild(allInfoButton);
        rigthButtonBox.appendChild(form);
        rigthButtonBox.appendChild(leaveButton);
        buttonBox.appendChild(leftButtonBox);
        buttonBox.appendChild(rigthButtonBox);
        container.appendChild(buttonBox);

        const contentBox = document.createElement('div');
        contentBox.className = 'content-box';

        const chartBox = document.createElement('div');
        chartBox.className = 'chart-box';

        const headerTitle2 = document.createElement('h2');
        headerTitle2.className= "chart-box-label";
        headerTitle2.textContent = "Загальна успішність";

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';

        const chartCanvas = document.createElement('canvas');
        chartCanvas.id = 'authorAccuracyChart';
        chartCanvas.className = 'authorAccuracyChart';
        chartCanvas.width = 1000;
        chartCanvas.height = 600;

        chartBox.appendChild(headerTitle2);

        chartBox.innerHTML += `
            <select name="choice" id="choice">
                <option value="1">Загальна успішність</option>
                <option value="2">Кількість правильних/неправильних відповідей</option>
                <option value="3">Відсоткове співвідношення правильних відповідей</option>
                <option value="4">Витрачено часу на запитання</option>
                <option value="5">Зароблено монет за питання</option>
            </select>
        `;

        chartWrapper.appendChild(chartCanvas);
        chartBox.appendChild(chartWrapper);
        contentBox.appendChild(chartBox);

        //
        const infoBox = document.createElement('div');
        infoBox.className = 'info-box';

        const baseInfo = document.createElement('div');
        baseInfo.className = 'base-info';

        const resultsInfoBox = document.createElement('div');
        resultsInfoBox.className = 'results-info-box';

        const headerTitle3 = document.createElement('h3');
        headerTitle3.textContent = "Підсумок";  

        // посчитать средний результат 
        const resultsInfoBoxText = document.createElement('p');
        resultsInfoBoxText.id= "results-info-box-text";
        resultsInfoBoxText.innerHTML= `<p><strong>Середній результат: </strong>${averega_score}%</p>`;

        // найти лучший результат
        const resultInfoBestScore = document.createElement('p');
        resultInfoBestScore.id= "results-info-box-text2";
        resultInfoBestScore.innerHTML = `<p><strong>Найбільший результат: </strong>${best_score_data.accuracy}%</p>`;

        const resultInfoWorstScore = document.createElement('p');
        resultInfoWorstScore.id= "results-info-box-text2";
        resultInfoWorstScore.innerHTML = `<p><strong>Найменший результат: </strong>${worst_score_data.accuracy}%</p>`;

        const worstResultQuestion = document.createElement('p');
        worstResultQuestion.id= "results-info-box-text2";
        worstResultQuestion.innerHTML = `
            <p>
                <strong>Найскладніше питання (${hardest_question_data.hardest_question_index + 1}): </strong>${hardest_question_data.question_text}<br>
                <strong>Кількість правильних відповідей: </strong>${hardest_question_data.correct_answers}<br>
                <strong>Кількість неправильних відповідей: </strong>${Object.keys(resultData).length - hardest_question_data.correct_answers}<br>
                <strong>В середньому витрачено часу на відповідь: </strong> ${hardest_question_data.total_time / Object.keys(resultData).length} c
            </p>`;

        resultsInfoBox.appendChild(headerTitle3);
        resultsInfoBox.appendChild(resultInfoBestScore);
        resultsInfoBox.appendChild(resultInfoWorstScore);
        resultsInfoBox.appendChild(resultsInfoBoxText);
        resultsInfoBox.appendChild(worstResultQuestion);

        resultTable = document.createElement('div');
        resultTable.className = 'results-table';

        resultTable.style.setProperty(
            'grid-template-columns',
            `10vw repeat(${totalQuestion}, ${77.9 /totalQuestion}vw) 10.075vw`
        );

        const resultHeader = document.createElement('div');
        resultHeader.className = 'results-header';

        const headerUsers = document.createElement('div');
        headerUsers.className = 'label';  
        headerUsers.textContent= "Учні";

        resultHeader.appendChild(headerUsers);
        accuracyAquestionsArray.forEach(questionFor => {
            const div = document.createElement('div');
            div.className= "cell";
            div.innerHTML = `${questionFor.question}`;
            resultHeader.appendChild(div);
        });

        const headerAccyracy = document.createElement('div');
        headerAccyracy.className = 'label';  
        headerAccyracy.textContent= "Точність";
        
        resultHeader.appendChild(headerAccyracy);
        resultTable.appendChild(resultHeader);
        
        for (const username in resultData) {
            const answersArray = resultData[username].correct_answers_list; 
            appendResultRow(resultTable, username, answersArray, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        };
        
        const legenBox = document.createElement('div');
        legenBox.className = 'legend-box';
    
        const legenBoxTitle = document.createElement('h3');
        legenBoxTitle.textContent = "Позначення";
    
        const legend = document.createElement('div');
        legend.className= "legend";
        legend.innerHTML += `
                <span><span class="circle correct"></span> Правильно</span>
                <span><span class="circle wrong"></span> Неправильно</span>
                <span><span class="circle no-answer"></span> Немає відповіді</span>
            `;

        baseInfo.appendChild(resultsInfoBox);
        legenBox.appendChild(legenBoxTitle);
        legenBox.appendChild(legend);
        baseInfo.appendChild(legenBox); 
        infoBox.appendChild(baseInfo);

        contentBox.appendChild(infoBox);
        container.appendChild(contentBox);

        const tableTitle = document.createElement('div');
        tableTitle.className = 'results-table-block';

        const userTitle = document.createElement('h1');
        userTitle.textContent = "Натисніть на ряд таблиці щоб побачити особисту статистику";

        tableTitle.appendChild(userTitle);
        container.appendChild(tableTitle);
        container.appendChild(resultTable);

        tableReady = true;

        pendingResults.forEach(({username, result}) => {
            if (document.getElementById(`row_${username}`)) return;

            resultData[username] = result;
            appendResultRow(resultTable, username, result.correct_answers_list, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        });

        renderAccuracyLineChart('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);

        document.getElementById('choice').addEventListener('change', function() {
            if (selectBlock){
                renderAnalyticsChart('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
            };
        });
    });

    socket.on("author_receive_new_result", function(data) {  
        const username = data.username;
        const result = data.user_result;

        if (!tableReady || !resultTable){
            pendingResults.push({username, result});
            return;
        };

        if (document.getElementById(`row_${data.username}`)) return;

        userCount++;
        userArray.push(data.username);
        resultData[username] = result;

        appendResultRow(resultTable, username, result.correct_answers_list, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
    });
};

