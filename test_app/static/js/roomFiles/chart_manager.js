function renderAnalyticsChart(canvasId, resultData, accuracyAquestionsArray, accurancyArray, totalQuestion, userName= null){
    const selectElement = document.getElementById("choice");

    if (userName){
        choiceSelector= document.getElementById('choice')
        chartBoxLable= document.querySelector('.chart-box-label')
        console.log(chartBoxLable)
        chartBoxLable.textContent= `Успішність ${userName}`

        selectBlock= false
        choiceSelector.innerHTML= `
            <option value="1">${userName} успішність</option>
            <option value="3">${userName} відсоток правильності проходження</option>
            <option value="4">${userName} витрачений час на питання</option>
            <option value="5">${userName} зароблено монет за питання</option>
        `

        selectUserName= userName
        renderAccuracyLineChart(canvasId, resultData, accuracyAquestionsArray, accurancyArray, userName)
    }

    switch (Number(selectElement.value)){
        case 1:
            renderAccuracyLineChart(canvasId, resultData, accuracyAquestionsArray, accurancyArray, selectUserName)
            break;
        case 2:
            renderCorrectWrongBarChart(canvasId, resultData, totalQuestion, selectUserName)
            break;
        case 3:
            renderUserResultPieChart(canvasId, resultData, totalQuestion, selectUserName)
            break; 
        case 4:
            renderQuestionValuesLineChart(canvasId, resultData, totalQuestion, selectUserName, "time")
            break; 
        case 5:
            renderQuestionValuesLineChart(canvasId, resultData, totalQuestion, selectUserName, "token")
            break; 
        case 6:
            renderRightWorstBar(canvasId, resultData, totalQuestion, selectUserName)
            break;
    }

    selectBlock= true
}


function questionAccuracy(resultData, totalQuestion){
    let accurancyArray= []
    let accuracyAquestionsArray= []
    let allAnswersArray= Object.values(resultData)
    const userCount = Object.keys(allAnswersArray).length;

    for (let question_number= 0; question_number < totalQuestion; question_number++){
        let pas_accurasy= 0;
        for (let array= 0; array < allAnswersArray.length; array++){
            if (allAnswersArray[array].correct_answers_list[question_number] === 1){
                pas_accurasy++
            }
        }
        
        const accuracy= (pas_accurasy / userCount) * 100;
        accurancyArray.push(accuracy.toFixed(1));
    } 

    for (number=0; number < totalQuestion; number++){
        accuracyAquestionsArray.push({
            question: `Q${number + 1}`,
            accuracy: `${accurancyArray[number]}`
        });
    }

    return {accuracyAquestionsArray, accurancyArray}
}


function renderRightWorstBar(canvasId, resultData, totalQuestion, user){
    const ctx= document.getElementById(canvasId).getContext('2d');

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    correctAnswer= 0;
    let answers= resultData[user].correct_answers_list;
    for (let number=0; number < totalQuestion; number++){
        let answer= answers[number]
        if (answer === 1){
            correctAnswer++;
        }
    }

    charts[canvasId]= new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Правильні відповіді', 'Усього питань'],
            datasets: [{
                label: 'Результат',
                data: [correctAnswer, totalQuestion - correctAnswer],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderAccuracyLineChart(canvasId, resultData, accuracyAquestionsArray, accurancyArray, userName= null){
    let accurancyNumbers= []
    let labels= []

    if (userName && resultData[userName]){
        accurancyNumbers= resultData[userName].correct_answers_list.map(result =>{
            switch (result){
                case 0:
                    return 0
                case 1:
                    return 100
                case 2:
                    return 0 
            }
        })
    } else{
        accurancyNumbers= accurancyArray.map(Number)
        labels= accuracyAquestionsArray.map(item => item.question)
    }

    const ctx= document.getElementById(canvasId).getContext('2d');

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
  
    charts[canvasId]= new Chart(ctx, {
        type: 'line',
        data: {
            labels: accuracyAquestionsArray.map(item => item.question),
            datasets: [{
                label: 'Точність відповідей (%)',
                data: accurancyNumbers,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 5
            }]
        },
        options: {
            scales: {
                y:{
                    beginAtZero: true,
                    suggestedMax: 100,
                    title: {
                        display: true,
                        text:'Точність (%)'
                    }
                },
                x: {
                    title:{
                        display: true,
                        text: 'Номер питання'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


function renderCorrectWrongBarChart(canvasId, resultData, totalQuestion, userName= null){
    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const labels= []
    const correctCounts= new Array(totalQuestion).fill(0)
    let wrongCounts= new Array(totalQuestion).fill(0)

    let users= Object.keys(resultData)
    if(userName){
        users= users.includes(userName) ? [userName] : []
    }

    if (!users.length){
        return
    }

    users.forEach(user =>{
        let answers= resultData[user].correct_answers_list
        for (let number=0; number < totalQuestion; number++){
            let answer= answers[number]
            if (answer === 1){
                correctCounts[number]++
            } else{
                wrongCounts[number]++
            }
        }
    })

    let newWrongCounts= wrongCounts.map(count => -count)

    for (let label= 0; label < totalQuestion; label++){
        labels.push(`Q${label+ 1}`)
    }

    charts[canvasId]= new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Правильно",
                    data: correctCounts,
                    backgroundColor: '#43a047',
                    borderColor: '#43a047',
                    borderWidth: 1
                },
                {
                    label: 'Неправильно / пропущено',
                    data: newWrongCounts,
                    backgroundColor: '#e53935',
                    borderColor: '#e53935',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Номер питання'
                    }
                },
                y: {
                    beginAtZero: false,
                    min: -Math.ceil(Math.max(...wrongCounts) * 1.2),
                    max: Math.ceil(Math.max(...correctCounts) * 1.2),
                    title: {
                        display: true, 
                        text: 'Кількість користувачів'
                    },
                    ticks: {
                        callbacks: value => Math.abs(value)
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.datasets.label+ ': '+ Math.abs(ctx.parsed.y) 
                    }
                }
            }
        }
    })
}


function renderUserResultPieChart(canvasId, resultData, totalQuestion, userName= null){
    const CHART_COLORS = [
        '#1E88E5', '#43A047', '#F4511E', '#8E24AA', '#3949AB', '#00ACC1', '#FB8C00', '#6D4C41', '#546E7A', 
        '#5E35B1','#039BE5','#00897B','#7CB342','#C0CA33','#FDD835','#FF7043','#8D6E63','#78909C','#EC407A'
    ];

    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    const dataValues= []
    const dataColors= []
    
    let correctTotal= 0
    let users= Object.keys(resultData)
    let totalSlices= users.length* totalQuestion
    if(userName){
        users= users.includes(userName) ? [userName] : []
        totalSlices= totalQuestion
    }

    users.forEach((user, index) => {
        const answers= resultData[user].correct_answers_list
        const correctCount= answers.filter(answer => answer === 1).length
        correctTotal += correctCount

        dataValues.push(correctCount)
        dataColors.push(CHART_COLORS[index])
    })

    let remaining= totalSlices- correctTotal
    if (remaining > 0){
        dataValues.push(remaining)
        dataColors.push('#e53935')
    }

    const labels= [...users]
    if (remaining > 0){
        labels.push("Неправильні / пропущені")
    }

    charts[canvasId]= new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: dataColors,
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context){
                            const label= context.label
                            const value= context.parsed
                            const percent= ((value/ totalSlices) * 100).toFixed(1)
                            return `${label}: ${value} (${percent}%)`
                        }
                    }
                }
            }
        }
    })
}


function renderQuestionValuesLineChart(canvasId, resultData, totalQuestion, userName= null, type){
    const ctx= document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    let labels= []
    const totalTimers= new Array(totalQuestion).fill(0)

    let users= Object.keys(resultData)
    if(userName){
        users= users.includes(userName) ? [userName] : []
    }

    if (!users.length){
        return
    }

    let type_list= []
    users.forEach(user => {
        if (type === "token"){
            type_list= resultData[user].token_list
        } else if (type === "time"){
            type_list= resultData[user].timers_list
        }
        for (let number= 0; number < totalQuestion; number++){
            const time= parseFloat(type_list[number])
            totalTimers[number] += time
        }
    })

    for (let label= 0; label < totalQuestion; label++){
        labels.push(`Q${label+ 1}`)
    }

    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Суммарное время (сек) на вопрос',
                data: totalTimers,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Номер вопроса'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Суммарное время (сек)'
                    }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}


function renderDoughnutChart(canvasId, totalAnswer, correctCount){
    let correctPercent= (correctCount/totalAnswer) * 100;
    let incorrectPercent= 100- correctPercent;
    
    try {
        let existing_chart = Chart.getChart('donat-chart')
        existing_chart.destroy();

        let lastChart = Chart.getChart('authorAccuracyChart')
        if (lastChart){
            lastChart.destroy()
        }
    } catch(error) {
    }

    const ctx= document.getElementById(canvasId).getContext('2d');
    donatChart= new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Правильні (%)', 'Неправильні (%)'],
            datasets: [{
                data: [correctPercent, incorrectPercent],
                borderColor: ['rgba(69, 184, 46, 0.6)', 'rgba(186, 47, 60, 0.6)'],
                backgroundColor: ['rgba(69, 184, 46, 1)', 'rgba(186, 47, 60, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
            cutout:'50%'
            }
        }
    });
}