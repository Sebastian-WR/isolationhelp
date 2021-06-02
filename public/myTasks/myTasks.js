$('#go-to-create').click(() => {
    console.log(location)
    location.href = `${location.origin}/createTask`
    console.log(location)
})
;(async function getMyTasks() {
    try {
        const response = await fetch(`/api/tasks/?sort=mytasks`)
        const body = await response.json()
        const tasks = body.tasks

        const tableBody = $('#table-body')
        if (tasks) {
            tasks.map((task) => {
                const tableRow = $('<tr></tr>')

                tableRow.append($('<td></td>').text(task.title))
                tableRow.append($('<td></td>').text(task.category ? task.category : 'NO CATEGORY'))
                tableRow.append($('<td></td>').text(task.location ? task.location : 'NO LOCATION'))
                tableRow.append($('<td colspan="3"></td>').text(task.date ? task.date : 'NO DATE'))

                tableBody.append(tableRow)
            })
        } else {
            const tableRow = $('<tr></tr>')

            tableRow.append($('<td></td>').text('N/A'))
            tableRow.append($('<td></td>').text('N/A'))
            tableRow.append($('<td></td>').text('N/A'))
            tableRow.append($('<td></td>').text('N/A'))
            tableRow.append($('<td></td>').text('N/A'))
            tableRow.append($('<td></td>').text('N/A'))

            tableBody.append(tableRow)
        }
    } catch (error) {
        console.log(error)
    }
})()
