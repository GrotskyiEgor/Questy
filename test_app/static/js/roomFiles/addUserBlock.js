function leaveTest(){
    clearCookie(["temporaryName"])
    window.location.href = `/`;
}

function leaveTestBlock(kick_user, ip, type){
    clearCookie(["temporaryName", "isReconnected", "time", "room"])
    window.location.href = `/`;
}

function userLeaveTest() {
    clearCookie(["room", "state", "userAnswers", "userTimers", "userTokens", "countUsersAnswer", "temporaryName", "timeStop", "time", "reconnect"])
    window.location.href = '/';
}

function authorLeaveTest(type){
    let currentURL = window.location.href;
    let roomCode = currentURL.split('room')[1];
    roomCode= roomCode.split("?")[0]
   
    if (type === "wait"){
        socket.emit("test_end", {
            room: room,         
            username: username  
        });
    }
     
    socket.emit("test_end", {
        room: roomCode
    });
    
    clearCookie(["room", "state", "userList", "countCorrectAnswer", "countUsersAnswer", "blockedUsers", "timeStop", "time"])

    setTimeout(() => {
        window.location.href = '/'; 
    }, 200);
}

function kickUser(kick_user, ip, type) {   
    let UserList= getCookie("userList") || ""
    let users= UserList.split("</>").filter(username => username.trim() !== "")

    users= users.filter(userStr => {
        const [name, userIp]= userStr.split("()")
        return name !== kick_user
    })

    const newUserList = users.join("</>")

    setCookie("userList", newUserList)
    socket.emit("kick_user", {
        room: room,
        user: kick_user
    });

    if (type === "block"){
        let blockUserArray= getCookie("blockedUsers")
        
        if (!blockUserArray){
            setCookie("blockedUsers", ip)
        } else{
            setCookie("blockedUsers", `${blockUserArray}$%^${ip}`)
        }
    }

    let removeUserBlock= document.getElementById(`user${kick_user}`)

    if (removeUserBlock) {
        removeUserBlock.remove()
    }
}

function addUesrBlock(username, button){
    const userBlock = button.closest(".user-block")
    const userIP = userBlock.querySelector(".user-ip").textContent.trim()
    let addUserList = getCookie("userList")

    if (!addUserList){
        setCookie("userList", `${username}()${userIP}`)
    } else {
        setCookie("userList", `${addUserList}</>${username}()${userIP}`)
    }

    if (userBlock){
        userBlock.remove()
    }
    
    socket.emit("new_user", {
        room: room,
        username: username,
        author_name: authorName,
        user_ip: userIP ?? null
    });
}

function createUserBlock(username, authorName, blockUsername, ip, type) {   
    let userListDiv
    let checkingUserBlock
    if (type === "not"){
        userListDiv= document.getElementById("user-list")
        const emptyUserBlock= document.getElementById("emty-users-list")
    
        if (emptyUserBlock){
            emptyUserBlock.remove();
        }
        
        checkingUserBlock= document.getElementById(`user${blockUsername}`)
        
        if (checkingUserBlock) {
            return
        }
    } else {
        userListDiv= document.getElementById("wait-users") 
        checkingUserBlock= document.getElementById(`${blockUsername}`)
        
        if (checkingUserBlock) {
            return
        }
    }
    
    const userBlock= document.createElement("div");
    userBlock.className= "user-block";
    userBlock.id= `user${blockUsername}`

    const userName= document.createElement("div");
    userName.className= "user-name";
    userName.textContent = `${blockUsername}`;
    userBlock.appendChild(userName);

    const userActions= document.createElement("div");
    userActions.className= "user-actions";
     
    let kickType 
    if (username === authorName){
        const btnRemove= document.createElement("button");
        btnRemove.className= "btn-remove";
        btnRemove.type= "button";

        if (ip){
            const userIP= document.createElement("p")
            userIP.textContent= `ip: `
    
            const spanIP= document.createElement("span")
            spanIP.className= "user-ip"
            spanIP.textContent= ip
    
            userIP.appendChild(spanIP)
            userBlock.appendChild(userIP)
        }
        
        if (type === "wait"){
            btnRemove.textContent= "Заблокувати"
            kickType= "block"

            const btnKick= document.createElement("button");
            btnKick.className= "btn-remove";
            btnKick.type= "button";
            btnKick.textContent= "Видалити"
            
            btnKick.onclick = function () {
                kickUser(blockUsername, ip, "kick");
            };

            userActions.appendChild(btnKick);
        } else{
            btnRemove.textContent= "Видалити"
            kickType= "kick"
        }

        btnRemove.onclick = function () {
            kickUser(blockUsername, ip, kickType);
        };

        if (type === "wait"){
            const btnAccept= document.createElement("button");
            btnAccept.className= "btn-accept";
            btnAccept.type= "button";
            btnAccept.textContent= "Прийняти"
            btnAccept.onclick = function () {
                addUesrBlock(blockUsername, this);
            };
            
            userActions.appendChild(btnAccept);
        }
        
        userActions.appendChild(btnRemove);
        userBlock.appendChild(userActions);
    }

    if (userListDiv){
        userListDiv.appendChild(userBlock);
        return userListDiv;
    }

    return
}


function getDeviceId(){
    let id = localStorage.getItem("device_id");

    if (!id){
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        id = "";

        for (let letter = 0; letter < 16; letter++){
            id += chars[Math.floor(Math.random() * chars.length)];
        }
        localStorage.setItem("device_id", id);
    }

    return id;
}