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
                timerText.textContent = "";
                timerText.innerHTML = `
                    <img src="test_app/static/images/online_test/time.png" class="online-img">
                    `
        
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