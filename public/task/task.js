;(async function getTask() {
    // Will not work on other than local host
    // const queryString = window.location.href.substr(28)
    const urlParams = new URLSearchParams(window.location.search)
    const idParam = urlParams.get('id')
    try {
        const response = await fetch(`/api/tasks/${idParam}`)
        const body = await response.json()
        const task = body.task

        const tableBody = $('#table-body')

        const tableRow = $('<tr></tr>')

        tableRow.append($('<td></td>').text(task.title))
        tableRow.append($('<td></td>').text(task.description))
        tableRow.append($('<td></td>').text(task.location ? task.location : 'No location'))
        tableRow.append($('<td></td>').text(task.date ? task.date : 'No Date'))
        tableRow.append($('<td></td>').text(task.time ? task.time : 'No time'))
        tableRow.append($('<td></td>').text(task.reward ? task.reward : 'No reward'))

        tableBody.append(tableRow)
    } catch (error) {
        console.log(error)
    }
})()
