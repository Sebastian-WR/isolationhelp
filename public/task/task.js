const urlParams = new URLSearchParams(window.location.search)
const idParam = urlParams.get('id')

;(async () => {
    try {
        const response = await fetch(`/api/tasks/${idParam}`)
        const body = await response.json()
        const task = body.task

        const taskInfo = $('#task-info')

        if (task.title) taskInfo.append($('<h1></h1>').text(`TITLE: ${task.title}`))
        if (task.location) taskInfo.append($('<h1></h1>').text(`LOCATION: ${task.location}`))
        if (task.date) taskInfo.append($('<h1></h1>').text(`DATE: ${task.date}`))
        if (task.time) taskInfo.append($('<h1></h1>').text(`TIME: ${task.time}`))
        if (task.reward) taskInfo.append($('<h1></h1>').text(`REWARD: ${task.reward}`))
        taskInfo.append($('<h1></h1>').text(`DESCRIPTION: ${task.description}`))

        if (task.takenById) {
            $('.change-status').prop('id', 'remove-task').text('Remove task')
        } else {
            $('.change-status').prop('id', 'take-task').text('Take task')
        }
    } catch (error) {
        console.log(error)
    }
})()

$('#take-task').on('click', async () => {
    const result = await fetch(`/api/tasks/${idParam}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idParam,
            type: 'take',
        }),
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! You volunteered')
        window.location.href = '/tasks'
    } else {
        console.log(body.message)
    }
})

$('#remove-task').on('click', async () => {
    console.log('removed pressed')
    const result = await fetch(`/api/tasks/${idParam}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idParam,
            type: 'remove',
        }),
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! You removed volunteering')
        window.location.href = '/myvolunteering'
    } else {
        console.log(body.message)
    }
})
