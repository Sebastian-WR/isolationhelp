const urlParams = new URLSearchParams(window.location.search)
const idParam = urlParams.get('id')

;(async () => {
    try {
        const response = await fetch(`/api/tasks/${idParam}`)
        const body = await response.json()
        const task = body.task

        const tableInfo = $('#task-info')

        if (task.title) tableInfo.append($('<h1></h1>').text(`TITLE: ${task.title}`))
        if (task.location) tableInfo.append($('<h1></h1>').text(`LOCATION: ${task.location}`))
        if (task.date) tableInfo.append($('<h1></h1>').text(`DATE: ${task.date}`))
        if (task.time) tableInfo.append($('<h1></h1>').text(`TIME: ${task.time}`))
        if (task.reward) tableInfo.append($('<h1></h1>').text(`REWARD: ${task.reward}`))
        tableInfo.append($('<h1></h1>').text(`DESCRIPTION: ${task.description}`))
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
        $('#success').text('Success! \nYou voluteered')
        window.location.href = '/tasks'
    } else {
        console.log(body.message)
    }
})
