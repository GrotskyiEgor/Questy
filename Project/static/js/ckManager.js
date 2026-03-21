function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value){
    let updateCookie= encodeURIComponent(name)+ "="+ encodeURIComponent(value)
    document.cookie= `${updateCookie}; path=/`
}

function clearCookie(nameList){
    nameList.forEach(name => {     
        if (!getCookie(name)){
            return
        }
        document.cookie= `${encodeURIComponent(name)}=; max-age=0; path=/`
    });
}

function setMusicTheme(playId){
    setAllMute()
    
    if (!testMusic) return;

    const musicArray = document.querySelectorAll(".music-theme");

    musicArray.forEach(music => {
        if (music.id === playId){
            music.muted = false;
            music.currentTime = 0;
            music.play().catch(error => console.log(error))
        } else {
            music.muted = true;
            music.pause();
            music.currentTime = 0;
        }
    })
}

function setAllMute(){
    const musicArray = document.querySelectorAll(".music-theme")

    musicArray.forEach(music => {
        music.muted = true;
        music.pause();
        music.currentTime = 0;
    })
}

function playSound(playId){
    const musicArray = document.querySelectorAll(".music-sound")

    musicArray.forEach(music => {
        if (music.id === playId){
            music.currentTime = 0;
            music.play().catch(error => console.log(error))
        }
    })
}