// function exel_table(username, authorName, resultData, best_score_data){
//     const firstUser = Object.keys(resultData)[0];
//     const totalQuestions = resultData[firstUser].length;

//     let headerRow = ["Учень"];
//     for (let i = 1; i <= totalQuestions; i++) {
//         headerRow.push(`Q${i}`);
//     }
//     headerRow.push("Точність");

//     let table = [];
//     table.push(headerRow);

//     let totalAccuracy = 0;
//     let usersCount = 0;
//     for (const user in resultData) {
//         const answers = resultData[user].correct_answers_list;
//         const correct = answers.filter(a => a === 1).length;
//         const accuracyNumber = correct / answers.length;
//         const accuracy = (accuracyNumber * 100).toFixed(1) + "%";

//         totalAccuracy += accuracyNumber;
//         usersCount++;

//         let row = [user];

//         answers.forEach(a => {
//             if (a === 1) row.push("✅");
//             else if (a === 0) row.push("❌");
//             else row.push("-"); 
//         });

//         row.push(accuracy);
//         table.push(row);
//     }
//     const averageAccuracy = ((totalAccuracy / usersCount) * 100).toFixed(1) + "%";
//     console.log(totalAccuracy)
//     table.push([]);
//     table.push(["Найкращий результат", best_score_data.user_name,`${best_score_data.accuracy}%`]);
//     table.push(["Середній результат", averageAccuracy]);
    

//     const worksheet = XLSX.utils.aoa_to_sheet(table);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

//     XLSX.writeFile(workbook, "results.xlsx");
// }