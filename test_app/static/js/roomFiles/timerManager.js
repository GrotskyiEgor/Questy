function plusTime(){
    socket.emit(SOKET_PLUS_TIME, {
        room: room,
        author_name: authorName
    });
}

function stopTime(){
    socket.emit(SOKET_CHANGE_TIME, {
        room: room,
        author_name: authorName
    });
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
        const cookieTime= parseInt(getCookie("time"));
        let time= parseInt(timerText.textContent);

        timerText.textContent= time;

        if (isNaN(cookieTime) && username != authorName){
            renderWaitQuestion("test");
        }

        if (!timerPaused){
            time -= 1
            timerText.textContent= time
            setCookie("time", time)
        }
        
        if (time < 0){
                clearInterval(timerInterval);
                timerText.textContent = "Час"
        
                setTimeout(() => {
                    if (username != authorName){
                        renderWaitQuestion("test");
                    }
            }, 2000)}
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