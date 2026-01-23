function renderResultTest(username, totalQuestion, listQuiz, listAnswers, testId) {
    let answersStr = getCookie("userAnswers");
    let answers_list= answersStr.split("|");
    let userAnswers = [];
    let answersArrey = [];

    for (let answer of answers_list) {
        if (answer != "|") {
            userAnswers.push(answer);
        }
    }

    for (let answer of userAnswers) {
        if (answer != "") {
            answersArrey.push(answer);
        }
    }

    let correctAnswer = 0;

    for (let count = 0; count < listQuiz.length; count++) {
        let arrayCorrectAnswers= []
        let arrayUserAnswers= []
        console.log(listQuiz[count].correct_answer, answersArrey[count], listQuiz[count].correct_answer === answersArrey[count])

        if (listQuiz[count].question_type === "multiple_choice"){
            arrayCorrectAnswers= listQuiz[count].correct_answer.split("%$№")
            arrayUserAnswers= answersArrey[count].split("$$$")
            let correctAnswerAccept= true
            console.log(arrayCorrectAnswers.length === arrayUserAnswers.length, arrayCorrectAnswers, arrayUserAnswers)

            if (arrayCorrectAnswers.length === arrayUserAnswers.length){
                arrayCorrectAnswers.sort();
                arrayUserAnswers.sort();

                for(let question= 0; question < totalQuestion; question++){
                    if (arrayCorrectAnswers[question] === arrayUserAnswers[question]){
                        correctAnswerAccept= true;
                    }
                }
            }
            else{
                correctAnswerAccept= false;
            }

            if (correctAnswerAccept){
                correctAnswer++;
                console.log("correctAnswer++;")
            }
        }
        else {
            if (listQuiz[count].correct_answer === answersArrey[count]) {     
                correctAnswer++;
                console.log("correctAnswer++;")
            }
        }
    }

    let accuracy = (correctAnswer / totalQuestion) * 100;

    const resultContainer = document.getElementById("room-content");
    resultContainer.innerHTML = "";
    resultContainer.id = 'results-container';
    resultContainer.className = 'results-container';

    const resultInfo = document.createElement('div');
    resultInfo.className = 'result-info';

    const testInfo = document.createElement('div');
    testInfo.className = 'text-info';

    const info1 = document.createElement('p');
    info1.innerHTML = `<strong>${username}</strong> ваш результат: <strong>${correctAnswer}</strong> з ${totalQuestion}`;

    const info2 = document.createElement('p');
    info2.innerHTML = `Точність правильних відповідей: <strong>${accuracy.toFixed(1)}%</strong>`;

    const leaveLink = document.createElement('a');
    leaveLink.className = 'home-link';

    const leaveButton = document.createElement('button');
    leaveButton.className = 'home-btn';
    leaveButton.textContent = 'Покинути тест';
    leaveButton.addEventListener("click", userLeaveTest);

    testInfo.appendChild(info1);
    testInfo.appendChild(info2);
    leaveLink.appendChild(leaveButton);
    testInfo.appendChild(leaveButton);

    resultInfo.appendChild(testInfo);

    const answerInfo = document.createElement('div');
    answerInfo.className = 'answer-info';
    answerInfo.innerHTML = `
        <ul>
            <li><span class="color-dot color-green"></span>Правильна відповідь (зелений)</li>
            <li><span class="color-dot color-yellow"></span>Ваша неправильна відповідь (жовтий)</li>
            <li><span class="color-dot color-red"></span>Неправильна відповідь (червоний)</li>
        </ul>
    `;

    resultInfo.appendChild(answerInfo);
    resultContainer.appendChild(resultInfo);

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'chart-wrapper';

    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'userChart';
    chartCanvas.width = 400;
    chartCanvas.height = 200;

    chartWrapper.appendChild(chartCanvas);
    resultContainer.appendChild(chartWrapper);

    for (let quiz_number = 0; quiz_number < totalQuestion; quiz_number++) {
        let quiz= listQuiz[quiz_number]
        const questionBlock = document.createElement('div');
        questionBlock.className = 'question-block';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'question-header';

        const question = document.createElement('div');
        question.textContent = `${quiz.question_text}`;
        questionHeader.appendChild(question);

        questionBlock.appendChild(questionHeader);

        if (quiz.question_type === "image"){
            const imageDiv = document.createElement("div");
            imageDiv.className = "image-result-div";

            const image = document.createElement("img");
            image.src = `/test_app/static/images/${testId}/${quiz.image_name}`;
            image.alt= "quiz image";

            imageDiv.appendChild(image)
            questionBlock.appendChild(imageDiv)
        }

        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionBlock.appendChild(questionText);

        if (quiz.question_type === "choice" || quiz.question_type === "image"){
            let answers= answersArrey[quiz_number]

            if (answers === "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
            }

            for (let answer_number = 0; answer_number < listAnswers[quiz_number].length; answer_number++) {
                let answerText = listAnswers[quiz_number][answer_number];
                answers= answersArrey[quiz_number]

                if (answerText !== quiz.correct_answer && answerText !== answers) {
                    const answerIncorrect = document.createElement('div');
                    answerIncorrect.className = 'answer incorrect';
                    answerIncorrect.textContent = `✗ ${answerText}`;
                    questionBlock.appendChild(answerIncorrect);
                } 
                else if (answers !== quiz.correct_answer && answerText === answers) {
                    const answerUserAnswers = document.createElement('div');
                    answerUserAnswers.className = 'answer user_answers';
                    answerUserAnswers.textContent = `✗ ${answerText}`;
                    questionBlock.appendChild(answerUserAnswers);
                } 
                else {
                    const answerCorrect = document.createElement('div');
                    answerCorrect.className = 'answer correct';
                    answerCorrect.textContent = `✓ ${answerText}`;
                    questionBlock.appendChild(answerCorrect);
                }
            }
        }
        else if (quiz.question_type === "input"){
            let answerText = listAnswers[quiz_number];
            let answers= answersArrey[quiz_number]

            if (answers === "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
            }

            if (quiz.correct_answer !== answers){             
                const answerIncorrect = document.createElement('div');
                answerIncorrect.className = 'answer incorrect';
                answerIncorrect.textContent = `✗ ${answers}`;
                questionBlock.appendChild(answerIncorrect);

                const questionTextDiv = document.createElement('div');
                questionTextDiv.className = 'question-text';
                questionTextDiv.textContent = `Правильний варіант.`;
                questionBlock.appendChild(questionTextDiv);

                const answerCorrect = document.createElement('div');
                answerCorrect.className = 'answer correct';
                answerCorrect.textContent = `✓ ${quiz.correct_answer}`;
                questionBlock.appendChild(answerCorrect);
            }
            else{
                const answerCorrect = document.createElement('div');
                answerCorrect.className = 'answer correct';
                answerCorrect.textContent = `✓ ${quiz.correct_answer}`;
                questionBlock.appendChild(answerCorrect);
            }
        }
        else if (quiz.question_type === "multiple_choice"){
            let answerText = listAnswers[quiz_number];
            let answers= answersArrey[quiz_number].split("$$$");
            let correct_answer_list= quiz.correct_answer.split("%$№");

            if (answers === "not_answer"){
                const notAnswerDiv = document.createElement('div');
                notAnswerDiv.className = 'answer no-answe';
                notAnswerDiv.textContent = `Відповідь відсутня`;
                questionBlock.appendChild(notAnswerDiv);
                for (let answer_number = 0; answer_number < answerText.length; answer_number++){
                    let answer= answerText[answer_number];

                    if (correct_answer_list.includes(answer)){
                        const answerCorrect = document.createElement('div');
                        answerCorrect.className = 'answer correct';
                        answerCorrect.textContent = `✓ ${answer}`;
                        questionBlock.appendChild(answerCorrect);
                    }
                    else {
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer incorrect';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                }
            }
            else{
                for (let answer_number = 0; answer_number < answerText.length; answer_number++){
                    let answer= answerText[answer_number];
    
                    if (correct_answer_list.includes(answer)){
                        const answerCorrect = document.createElement('div');
                        answerCorrect.className = 'answer correct';
                        answerCorrect.textContent = `✓ ${answer}`;
                        questionBlock.appendChild(answerCorrect);
                    }
                    else if (answers.includes(answer)){
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer user_answers';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                    else {
                        const answerIncorrect = document.createElement('div');
                        answerIncorrect.className = 'answer incorrect';
                        answerIncorrect.textContent = `✗ ${answer}`;
                        questionBlock.appendChild(answerIncorrect);
                    }
                }
            }
        }

        resultContainer.appendChild(questionBlock);
    }

    const ctx = chartCanvas.getContext('2d');
    setTimeout(function() {
        socket.emit("room_get_result", {
            room: room,
            username: username,
            author_name: authorName
        });
    }, 100); 


    socket.once('room_get_result_data', function(data) {  
        const resultData= data.room_get_result_data
        const best_score_data= data.best_score_data
        const averega_score= data.averega_score
        const {accuracyAquestionsArray, accurancyArray}= questionAccuracy(resultData, totalQuestion)

        const allInfoButton= document.createElement('button');
        allInfoButton.className= 'all-info-btn';
        allInfoButton.textContent = 'Загальна успішність'
        allInfoButton.addEventListener("click", () => {
            chartBoxLable= document.querySelector('.chart-box-label')
            console.log(chartBoxLable)
            chartBoxLable.textContent= 'Загальна успішність'
            
            selectUserName= null
            choiceSelector= document.getElementById('choice')

            selectBlock= false
            choiceSelector.innerHTML= `
                <option value="1">Загальна успішність</option>
                <option value="2">Кількість правильних/неправильних відповідей</option>
                <option value="3">Відсоткове співвідношення правильних відповідей</option>
                <option value="4">Витрачено часу на запитання</option>
                <option value="5">Зароблено монет за питання</option>
            `
            selectBlock= true
            renderAccuracyLineChart('authorAccuracyChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
        });

        document.getElementById('choice').addEventListener('change', function() {
            if (selectBlock){
                renderAnalyticsChart('userChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion)
            }
        })
    
        renderRightWorstBar('userChart', resultData, accuracyAquestionsArray, accurancyArray, totalQuestion);
    });
}


