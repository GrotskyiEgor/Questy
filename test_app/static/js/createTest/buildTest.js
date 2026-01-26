function buildTest(){
    data = {
        "topic": "",
        "description": "",
        "questions": [

        ]       
    }


    data["description"] = document.getElementById("test-description").value;
    data["topic"] = document.getElementById("test-title").value;

    let flagError = false
    let messageError = ""
    let questionCount= 0

    let arrayQuestionBlock = document.querySelectorAll(".question-block") 
    arrayQuestionBlock.forEach(questionBlock => {
        let questionData= {
            "question_type": "",
            "question_text": "",
            "options": [],
            "correct_answer": "",
            "time": 0
            }
        let questionInformation= questionData
        
        let answerRadioFlag = false
        let countAnswers = 0
        let countCorrectAnswers = 0
        let correctData = ""


        let questionText = questionBlock.querySelector(".question-text")
        let questionTime = questionBlock.querySelector(".question-time")

        if (questionText.value != "" && questionTime.value > 0 ){
            questionInformation["question_text"]= questionText.value
            questionInformation["time"] = parseInt(questionTime.value)
            questionInformation["question_type"] = questionBlock.querySelector(".answers").id

            if (data["description"] != "" && data["topic"] != ""){
                let arrayAnswersInput = questionBlock.querySelector(".answers").querySelectorAll(".answer-input")
                let imageInputArray = questionBlock.querySelectorAll(".answers .load-img")

                imageInputArray.forEach(imageInput => {
                    let imageName = imageInput.querySelector(".answer-image")
                    
                    if(imageName && imageName.files.length > 0){
                        questionInformation["image_name"] = imageName.files[0].name
                    }
                    else {
                        flagError= true
                        messageError = "Ви не вказали зображення для питання"
                    }
                })
                
                arrayAnswersInput.forEach(answerInput => {
                    if(questionBlock.querySelector(".answers").id === "choice"){
                        
                        let answerText = answerInput.querySelector(".answer-text")
                        let answerRadio = answerInput.querySelector(".question-radio")
                        
                        if (answerText.value != ""){
                            questionInformation["options"].push(answerText.value)
                            countAnswers = countAnswers + 1

                            if (answerRadio.checked){
                                questionInformation["correct_answer"] = answerText.value
                                answerRadioFlag = true
                        }
                        }
                        else{
                            flagError = true
                            messageError = "Ви не ввели текст відповіді"
                        }
                        
                    }
                    if(questionBlock.querySelector(".answers").id === "input"){
                        let answerText = answerInput.querySelector(".answer-text")
                        if (answerText.value != ""){
                            countAnswers = countAnswers + 2
                            answerRadioFlag = true
                            questionInformation["correct_answer"] = answerText.value
                        }
                        else{
                            flagError = true
                            messageError = "Ви не ввели текст відповіді"
                        }
                        
                    }
                    if(questionBlock.querySelector(".answers").id === "multiple_choice"){
                        
                        let answerText = answerInput.querySelector(".answer-text")
                        let answerRadio = answerInput.querySelector(".checkbox")
                        
                        if (answerText.value != ""){
                            questionInformation["options"].push(answerText.value)
                            countAnswers = countAnswers + 1

                        if (answerRadio.checked && countCorrectAnswers >= 1){
                            questionInformation["correct_answer"] += "%$№" + answerText.value   
                            answerRadioFlag = true
                            countCorrectAnswers += 1
                        }
                        else if(answerRadio.checked){
                            questionInformation["correct_answer"] += answerText.value   
                            answerRadioFlag = true
                            countCorrectAnswers += 1
                        }
                    }
                    else{
                        flagError = true
                        messageError = "Ви не ввели текст відповіді"
                    }
                    
                }
                if(questionBlock.querySelector(".answers").id === "image"){
                    
                    let answerText = answerInput.querySelector(".answer-text")
                    let answerRadio = answerInput.querySelector(".question-radio")
                    
                    if (answerText.value != ""){
                        questionInformation["options"].push(answerText.value)
                        countAnswers = countAnswers + 1

                            if (answerRadio.checked){
                                questionInformation["correct_answer"] = answerText.value
                                answerRadioFlag = true
                        }
                        }
                        else{
                            flagError = true
                            messageError = "Ви не ввели текст відповіді"
                        }
                        
                    }
                })
                if(answerRadioFlag && countAnswers >= 2){
                    questionCount += 1
                    data["questions"].push(questionInformation)
                }
                else{
                    flagError = true
                    messageError = "Ви не вибрали правильну відповідь або ввели мало питань"
                }
            }
            else{
                flagError = true
                messageError = "Ви неправильно ввели текст питання чи час"
            }         
        }
        else{
            flagError = true
            if(messageError === "")(messageError = "Ви не задали назву тесту або опис")
        }})
    
    if(flagError === false && questionCount > 2){
        correctData = data
    }
    
    return correctData
}

$("#submit-button").click(function () {
    const jsonData = buildTest()
    const imageData = new FormData

    imageData.append('data', JSON.stringify(jsonData))

    document.querySelectorAll(".answer-image").forEach((image) => {
        if (image.files.length > 0){
            const file = image.files[0]
            imageData.append(file.name, file)
        }
    })
    $.ajax({
        url: "/build_test",
        type: "POST",
        data: imageData,
        processData: false,
        contentType: false,
        success: function (data) {
            window.location.href = "/quizzes/"
        },
        error: function (xhr){
            console.log('error')
        }
    })
})



