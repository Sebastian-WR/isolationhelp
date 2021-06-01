
;(async function getMyTasks() {
    try {
        const response = await fetch(`/api/mytasks`)
        const body = await response.json()
        const tasks = body.tasks

        const tableBody = $('#table-body')

        tasks.map((task) => {
            const tableRow = $('<tr></tr>')

            tableRow.append($('<td></td>').text(task.title))
            tableRow.append($('<td></td>').text(task.category ? task.category : 'NO CATEGORY'))
            tableRow.append($('<td></td>').text(task.location ? task.location : 'NO LOCATION'))
            tableRow.append($('<td colspan="3"></td>').text(task.date ? task.date : 'NO DATE'))

            tableBody.append(tableRow)
        })
    } catch (error) {
        console.log(error)
    }
})()