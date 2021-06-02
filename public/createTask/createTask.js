$('#submit-task').click(async () => {
    const task = {}
    if ($('#create-task-title').val()) task.title = $('#create-task-title').val()
    if ($('#create-task-category').val()) task.category = $('#create-task-category').val()
    if ($('#create-task-location').val()) task.location = $('#create-task-location').val()
    if ($('#create-task-date').val()) task.date = $('#create-task-date').val()
    if ($('#create-task-time').val()) task.time = $('#create-task-time').val()
    if ($('#create-task-reward').val()) task.reward = $('#create-task-reward').val()
    if ($('#create-task-description').val()) task.description = $('#create-task-description').val()

    const result = await fetch('/api/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task,
        }),
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! \nYou created a new task')
        $('window').location('href', '/')
    } else {
        console.log(body.message)
    }
})
