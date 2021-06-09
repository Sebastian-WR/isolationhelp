const urlParams = new URLSearchParams(window.location.search)
const idParam = urlParams.get('id')

;(async () => {
    if (idParam) {
        try {
            const response = await fetch(`/api/tasks/${idParam}`)
            const body = await response.json()
            const task = body.task

            if (task.title) $('#create-task-title').val(task.title)
            if (task.category) $('#create-task-category').val(task.category)
            if (task.location) $('#create-task-location').val(task.location)
            if (task.date) $('#create-task-date').val(task.date)
            if (task.time) $('#create-task-time').val(task.time)
            if (task.reward) $('#create-task-reward').val(task.reward)
            if (task.description) $('#create-task-description').val(task.description)

            $('#submit-task').css('display', 'none')
            $('#edit-task').css('display', 'inline-block')
            $('#delete-task').css('display', 'inline-block')
        } catch (error) {
            console.log(error)
        }
    }
})()

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
            fields: task,
        }),
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! \nYou created a new task')
        window.location.href = '/mytasks'
    } else {
        console.log(body.message)
    }
})

$('#edit-task').click(async () => {
    const task = {}
    if ($('#create-task-title').val()) task.title = $('#create-task-title').val()
    if ($('#create-task-category').val()) task.category = $('#create-task-category').val()
    if ($('#create-task-location').val()) task.location = $('#create-task-location').val()
    if ($('#create-task-date').val()) task.date = $('#create-task-date').val()
    if ($('#create-task-time').val()) task.time = $('#create-task-time').val()
    if ($('#create-task-reward').val()) task.reward = $('#create-task-reward').val()
    if ($('#create-task-description').val()) task.description = $('#create-task-description').val()

    const result = await fetch(`/api/tasks/${idParam}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: task,
        }),
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! \nYou editet a new task')
        window.location.href = '/mytasks'
    } else {
        console.log(body.message)
    }
})

$('#delete-task').click(async () => {
    const result = await fetch(`/api/tasks/${idParam}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const body = await result.json()
    if (body.success) {
        $('#success').text('Success! \nYou deleted a new task')
        window.location.href = '/mytasks'
    } else {
        console.log(body.message)
    }
})
