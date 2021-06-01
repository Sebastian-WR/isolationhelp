//make ths for headerRow
//make trs with td for tableBody

;(async function getTasks() {
    try {
        const response = await fetch('/api/tasks')
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
                        .attr('href', `/tasks/${task._id}`)
                        .append(
                            $('<button></button>')
                                .text('Details')
                                .attr({ type: 'button', class: 'table-btn' }),
                        ),
                ),
            )

            tableBody.append(tableRow)
        })
    } catch (error) {
        console.log(error)
    }
})()
