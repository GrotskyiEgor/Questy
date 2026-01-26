function cardTaskCreate(tasksArray){

    let tasksHTMl= ""
    
    tasksArray.forEach(task => { 
        let taskHTML= ""
        let taskState= ""
        if (task.due_time) {
            taskState = `- здати до ${ task.due_time }`
        }
        else{
            taskState= " без дедлайну"
        }


        taskHTML= `
            <li>
                ${task.title}
                <span class="due-time-p">
                    ${taskState}
                </span>
            </li>`

        tasksHTMl += taskHTML
    })

    return tasksHTMl
}

$(() => {
    $(".my-classes").on('click', (event => {
        $.ajax({
            url: "/class_page/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "my_classes"}),
            success: function(data){
                let classDiv= $(".class-div")
                classDiv.empty()

                let cardDiv= $("<div class='card-div'></div>")
                classDiv.append("<h2>Доступні класи</h2>")

                const classes= data.classes
                const tasks_class_teacher_list= data.tasks_class_teacher_list 
                
                classes.forEach((clas, index) => {
                    
                    let bg_color= ""
                    tasksArray = tasks_class_teacher_list[index]

                    if (!clas.class_color2){
                        bg_color = clas.class_color1
                    }
                    else {
                        bg_color = `linear-gradient(135deg, ${clas.class_color1}, ${clas.class_color2})` 
                    }

                    let tasksHTMl= cardTaskCreate(tasksArray)
    
                    classCard =`
                        <div class="card with-tasks">
                            <div class="card-header" style="background: ${ bg_color };">
                                <div class="h-left-info">
                                    Назва классу: ${ clas.title }<br><span>Автор: ${ clas.teacher.username }</span><span>Код: ${ clas.class_code }</span>
                                </div>
    
                                <div class="class-actions">
                                    <button class="more-class-actions">⋮</button>
                                    
                                    <div class="dropdown">
                                        <form action="/delete_class${ clas.id }" method="POST">
                                            <button type="submit" class="dropdown-btn d">Видалити класс</button>
                                        </form>
    
                                        <a href="/class_information ${ clas.id }" class="dropdown-btn i">
                                            Інформація про класс
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
    
                            <div class="card-body">
                                <ul>
                                    ${tasksHTMl}
                                </ul>
                            </div>
    
    
                            <div class="card-footer">
                                <a href="/class_courses ${ clas.id }">
                                    <button class="start-btn" style="background: ${ bg_color };">
                                        Перейти до классу
                                    </button>
                                </a>
                                <a href="/create_task ${ clas.id }">
                                    <button class="start-btn" style="background: ${ bg_color };">
                                        Створити завдання
                                    </button>
                                </a>
                            </div>
                        </div>`
                    
                    cardDiv.append(classCard)
                });

                classDiv.append(cardDiv)
            },
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))

    $(".classes").on('click', (event => {
        $.ajax({
            url: "/class_page/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "classes"}),
            success: function(data){
                let classDiv= $(".class-div")
                classDiv.empty()

                let cardDiv= $("<div class='card-div'></div>")
                classDiv.append("<h2>Мої класи</h2>")

                const classes= data.classes_list
                const tasks_class_user_list= data.tasks_class_user_list 

                classes.forEach((clas, index) => {
                    
                    let bg_color= ""
                    tasksArray = tasks_class_user_list[index]

                    if (!clas.class_color2){
                        bg_color = clas.class_color1
                    }
                    else {
                        bg_color = `linear-gradient(135deg, ${clas.class_color1}, ${clas.class_color2})` 
                    }

                    let tasksHTMl= cardTaskCreate(tasksArray)

                   classCard=` 
                        <div class="card with-tasks">
                            <div class="card-header" style="background: ${ bg_color };">
                                Назва классу: ${ clas.title }<br><span>Автор: ${ clas.teacher.username }</span>
                            </div>

                            <div class="card-body">
                                ${tasksHTMl}
                            </div>
                
                            <div class="card-footer">
                                <a href="/class_courses${ clas.id }">
                                    <button class="start-btn" style="background: ${ bg_color };">
                                        Перейти до классу
                                    </button>
                                </a>
                            </div>
                        </div>`

                    cardDiv.append(classCard)
                });

                classDiv.append(cardDiv)
            },
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))
})