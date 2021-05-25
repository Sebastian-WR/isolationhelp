;(async function getTask() {
    const queryString = window.location.href;
    var res = queryString.substr(28);
    console.log("heeL", res);
    try {
        const response = await fetch(`/api/tasks/${res}`)
        const body = await response.json()
        const task = body.task

        const tableBody = $('#table-body')

        const tableRow = $('<tr></tr>')

        tableRow.append($('<td></td>').text(task.title))
        tableRow.append($('<td></td>').text(task.description))
        tableRow.append($('<td></td>').text(task.location))
        tableRow.append($('<td></td>').text(task.date))
        tableRow.append($('<td></td>').text(task.time))
        tableRow.append($('<td></td>').text(task.reward))
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