function saveTestToLocalStorage() {
    const test = {
        title: document.getElementById("test-title").value,
        description: document.getElementById("test-description").value,
        image: document.getElementById("test-image").value
    };

    const questions = document.querySelectorAll(".question-block");

    questions.forEach((q, index) => {
        const qKey = `Q${index + 1}`;

        const questionText = q.querySelector(".question-text")?.value || "";
        const questionTime = q.querySelector(".question-time")?.value || "";

        const answersBlock = q.querySelector(".answers");
        const questionType = answersBlock ? answersBlock.id : "";

        const answers = [];
        let correctAnswer = null;
        let correctAnswers = [];

        const answerInputs = q.querySelectorAll(".answer-input");

        answerInputs.forEach((a) => {
            const text = a.querySelector(".answer-text")?.value || "";

            const radio = a.querySelector("input[type='radio']");
            const checkbox = a.querySelector("input[type='checkbox']");

            answers.push(text);

            if (radio && radio.checked) {
                correctAnswer = text;
            }

            if (checkbox && checkbox.checked) {
                correctAnswers.push(text);
            }
        });

        test[qKey] = {
            question_type: questionType,
            question_text: questionText,
            answer_options: answers,
            correct_answer: correctAnswer !== null ? correctAnswer : correctAnswers,
            time: questionTime
        };
    });

    localStorage.setItem("test", JSON.stringify(test));
}