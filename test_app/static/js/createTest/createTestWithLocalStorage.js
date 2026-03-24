document.addEventListener("DOMContentLoaded", function () {
    const savedTest = JSON.parse(localStorage.getItem("test"));

    if (!savedTest) return;

    // 👉 восстанавливаем title / description
    document.getElementById("test-title").value = savedTest.title || "";
    document.getElementById("test-description").value = savedTest.description || "";

    const testQuestion = document.querySelector(".test-question");

    let questionIndex = 0;

    Object.keys(savedTest).forEach((key) => {
        if (!key.startsWith("Q")) return;

        questionIndex++;
        const q = savedTest[key];

        let answersHTML = "";

        // 👉 генерируем ответы
        if (q.question_type === "choice") {
            q.answer_options.forEach((ans, i) => {
                answersHTML += `
                <div class="answer-input">
                    <input type="text" class="answer-text" value="${ans}">
                    <input type="radio" class="question-radio" name="correct-answer-q${questionIndex}" ${q.correct_answer === ans ? "checked" : ""}>
                    <span>Правильна</span>
                    <button type="button" class="delete-answer">✖</button>
                </div>`;
            });

            answersHTML = `
            <div class="answers" id="choice">
                <label>Варіанти відповідей:</label>
                ${answersHTML}
            </div>
            <button type="button" class="add-answer">Додати відповідь</button>`;
        }

        if (q.question_type === "multiple_choice") {
            q.answer_options.forEach((ans) => {
                const checked = q.correct_answer.includes(ans) ? "checked" : "";

                answersHTML += `
                <div class="answer-input">
                    <input type="text" class="answer-text" value="${ans}">
                    <input type="checkbox" class="checkbox" name="correct-answer-q${questionIndex}" ${checked}>
                    <span>Правильна</span>
                    <button type="button" class="delete-answer">✖</button>
                </div>`;
            });

            answersHTML = `
            <div class="answers" id="multiple_choice">
                <label>Варіанти відповідей:</label>
                ${answersHTML}
            </div>
            <button type="button" class="add-mutlti-answer">Додати відповідь</button>`;
        }

        if (q.question_type === "input") {
            answersHTML = `
            <div class="answers" id="input">
                <label>Варіанти відповідей:</label>
                <div class="answer-input">
                    <input type="text" class="answer-text" value="${q.answer_options[0] || ""}">
                </div>
            </div>`;
        }

        if (q.question_type === "image") {
            let imagePreview = q.image ? `<img src="${q.image}" style="max-width:100px;">` : "";

            q.answer_options.forEach((ans) => {
                answersHTML += `
                <div class="answer-input">
                    <input type="text" class="answer-text" value="${ans}">
                    <input type="radio" class="question-radio" name="correct-answer-q${questionIndex}" ${q.correct_answer === ans ? "checked" : ""}>
                    <span>Правильна</span>
                    <button type="button" class="delete-answer">✖</button>
                </div>`;
            });

            answersHTML = `
            <div class="answers" id="image">
                <label>Зображення:</label>
                <input type="file" class="answer-image">
                ${imagePreview}
                <label>Варіанти відповідей:</label>
                ${answersHTML}
            </div>
            <button type="button" class="add-answer">Додати відповідь</button>`;
        }

        const questionHTML = `
        <div class="question-block" id="q${questionIndex}">
            <div class="question-header">
                <span>Питання ${questionIndex}</span>
                <button type="button" class="delete-question">Видалити питання?</button>
            </div>

            <label>Формулювання питання:</label>
            <input type="text" class="question-text" value="${q.question_text}">

            <label>Час:</label>
            <input type="text" class="question-time" value="${q.time}">

            ${answersHTML}
        </div>
        `;

        testQuestion.insertAdjacentHTML("beforeend", questionHTML);
    });

    // 👉 обновляем глобальный счётчик
    countQuestion = questionIndex;
});