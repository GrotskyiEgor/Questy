function renderScores(data, type){
    let scoreResult= $(".score-result")
    scoreResult.empty()

    const scores= data.scores
    const tests= data.tests

    scores.forEach(score => {
        let testId = score.test_id !== undefined ? score.test_id : score[2];
        let test = tests.find(t => t.id === testId);

        if (test){
            let testDate= ''
            if (type === 'date'){
                testDate= `
                    <p><strong>Результат: </strong>${ score.accuracy }</p>
                    <p><strong>Дата: </strong>${ score.date_complete }</p>
                    <p><strong>Час: </strong>${ score.time_complete }</p> 
                `
            }else if (type === 'accuracy'){
                testDate= `
                    <p><strong>Результат: </strong>${ score[0] }</p>
                    <p><strong>Дата: </strong>${ score[3] }</p>
                    <p><strong>Час: </strong>${ score[4] }</p> 
                `
            }

            let testCard= `
            <div class="test-card">   
                <p><strong>Тест: </strong>${ test.title }</p>
                <p><strong>Опис: </strong>${ test.description }</p>
                <p><strong>Автор: </strong>${ test.author_name }</p>
                <p><strong>Код: </strong>${ test.test_code }</p>
                <a href="/review_results${ test.id }">
                    <button>Переглянути</button>
                </a>
                ${testDate}
            </div>`
    
            scoreResult.append(testCard)
        }
    });
}

$(() => {
    $('#choice').val('accuracy_by_date')

    $(".date").on('click', (event => {
        $.ajax({
            url: "/profile/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "date"}),
            success: function(data){
                renderScores(data, "date")
            },
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))

    $(".accuracy").on('click', (event => {
        $.ajax({
            url: "/profile/sorte",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({sortyType: "accuracy"}),
            success: function(data){
                renderScores(data, "accuracy")
            },
            error: function (xhr, status, error) {
                console.log(error)
            }  
        })
    }))
})