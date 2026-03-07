function newTask(){
    $.ajax ({
        url: "/class_page/task",
        method: "GET",
        dataType: "json",
        success: function (data) {
            const class_new_task = data["class_online_task"]    
            for (let element= 0; element < class_new_task.length; element++){
                const classCard = $(`#class-${class_new_task[element][2]}`)
                const cardHeader = classCard.find(".card-header")

                if (class_new_task[element][1] > 0){
                    cardHeader.find('.new-task-count').remove()
                    cardHeader.append(`<div class="new-task-count">${class_new_task[element][1]}</div>`)
                }
                else {
                    cardHeader.find('.new-task-count').remove()
                }
            }     
        },
        error: function(thx) {
            console.log(thx)
        }
    })
}

newTask()
setInterval(newTask, 5000)
