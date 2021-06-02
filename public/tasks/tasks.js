
;(async () => {
    try {
        const response = await fetch('/api/tasks/?sort=notyours')
        const body = await response.json()
        const tasks = body.tasks

        const tableBody = $('#table-body')

        tasks.map((task) => {
            const tableRow = $('<tr></tr>')

            tableRow.append($('<td></td>').text(task.title))
            tableRow.append($('<td></td>').text(task.category ? task.category : 'NO CATEGORY'))
            tableRow.append($('<td></td>').text(task.location ? task.location : 'NO LOCATION'))
            tableRow.append($('<td></td>').text(task.date ? task.date : 'NO DATE'))
            tableRow.append(
                $('<td></td>').append(
                    $('<a></a>')
                        .attr('href', `/tasks/info/?id=${task._id}`)
                        .append($('<button></button>').text('Details').attr({ type: 'button', class: 'table-btn' })),
                ),
            )

            tableBody.append(tableRow)
        })
    } catch (error) {
        console.log(error)
    }
})()
