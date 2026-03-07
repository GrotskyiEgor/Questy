function plusTime(){
    socket.emit("plus_time", {
        room: room,
        author_name: authorName
    });
}

function stopTime(){
    socket.emit("change_time", {
        room: room,
        author_name: authorName
    });
}

function timerStop(){
    timerPaused = true;
    setCookie("timeStop", "true")

    if (timerInterval){
        clearInterval(timerInterval);
        timerInterval = null
    }
}

function startTimer() {
    const timerText= document.getElementById("timer")
    let state= getCookie("state")
    
    if(!timerText){
        return
    }

    if (timerInterval){
        clearInterval(timerInterval)
    }

    timerInterval= setInterval(() =>{
        const cookieTime = Number(getCookie("time"));
        let time = Number(timerText.textContent);

        if (isNaN(cookieTime) && username != authorName){
            renderWaitQuestion("test", testMusic);
        }

        if (!timerPaused){
            time -= 1
            timerText.textContent= time
            setCookie("time", time)
        }
        
        if (time <= 0){
            clearInterval(timerInterval);
            timerText.textContent = "";
            timerText.innerHTML = `
                <img src="test_app/static/images/online_test/time.png" class="online-img">
                `

                
            setTimeout(() => {
                if (username != authorName){
                    renderWaitQuestion("test", testMusic);
                } else if (username === authorName){
                    countUsersAnswer = getCookie("countUsersAnswer");
                    correctAnswerChart = getCookie("countCorrectAnswer");

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
            }, 1000)
        } 
    }, 1000);
}

function resetTimer(newTime){
    const timerText= document.getElementById("timer") 

    if (timerText){
        timerText.textContent= newTime
        setCookie("time", newTime)
        startTimer()
    }
}