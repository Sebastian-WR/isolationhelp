;(async function getTask() {
    const queryString = window.location.href.substr(28)
    try {
        const response = await fetch(`/api/tasks/${queryString}`)
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
        tableRow.append(
            $('<td></td>').append(
                $('<a></a>')
                    .attr('href', `/tasks/${task._id}`)
                    .append(
                        $('<button></button>')
                            .text('Edit')
                            .attr({ type: 'button', class: 'table-btn' }),
                    ),
            ),
        )

        tableBody.append(tableRow)
    } catch (error) {
        console.log(error)
    }
})()
