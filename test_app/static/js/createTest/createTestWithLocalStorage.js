function showNotification() {
    const notification = document.getElementById("notification");
    notification.classList.add("show");
}

function closeNotification() {
    const notification = document.getElementById("notification");
    notification.classList.remove("show");
}

document.addEventListener("DOMContentLoaded", function () {
    const savedTest = JSON.parse(localStorage.getItem("test"));

    if (!savedTest) return;

    // 👉 восстанавливаем title / description
    document.getElementById("test-title").value = savedTest.title || "";
    document.getElementById("test-description").value = savedTest.description || "";
    if (savedTest.image) {
        window.onload = () => {
            setTimeout(showNotification, 2000);
        };
    }


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
                    <input type="text" class="answer-text" placeholder="Відповідь ${i + 1}" value="${ans}">
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
            q.answer_options.forEach((ans, i) => {
                const checked = q.correct_answer.includes(ans) ? "checked" : "";

                answersHTML += `
                <div class="answer-input">
                    <input type="text" class="answer-text" placeholder="Відповідь ${i + 1}" value="${ans}">
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
                    <input type="text" class="answer-text" placeholder="Відповідь" value="${q.answer_options[0] || ""}">
                </div>
            </div>`;
        }

        if (q.question_type === "image") {
            window.onload = () => {
                setTimeout(showNotification, 2000);
            };
            let imagePreview = q.image ? `<img src="${q.image}" style="max-width:100px;">` : "";

            q.answer_options.forEach((ans, i) => {
                answersHTML += `
                <div class="answer-input">
                    <input type="text" class="answer-text" placeholder="Відповідь ${i + 1}" value="${ans}">
                    <input type="radio" class="question-radio" name="correct-answer-q${questionIndex}" ${q.correct_answer === ans ? "checked" : ""}>
                    <span>Правильна</span>
                    <button type="button" class="delete-answer">✖</button>
                </div>`;
            });

            answersHTML = `
            <div class="answers" id="image">
                <label>Зображення:</label>
                <input type="file" class="answer-image" accept="image/*">
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
            <input type="text" class="question-text" name="question-text" value="${q.question_text}">

            <label>Час на виконання в секундах:</label>
            <input type="text" class="question-time" name="question-time" value="${q.time}">

            ${answersHTML}
        </div>
        `;

        testQuestion.insertAdjacentHTML("beforeend", questionHTML);
    });

    // 👉 обновляем глобальный счётчик
    countQuestion = questionIndex;
});