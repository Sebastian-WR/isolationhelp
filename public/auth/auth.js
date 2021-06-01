window.cookieconsent.initialise({
    palette: {
        popup: {
            background: '#edeff5',
            text: '#838391',
        },
        button: {
            background: '#4b81e8',
        },
    },
    theme: 'classic',
    position: 'bottom-right',
})

const container = $('#container')
$('#signUp').click(() => {
    container.addClass('right-panel-active')
})

$('#signIn').click(() => {
    container.removeClass('right-panel-active')
})

$('#submit-sign-up').click(async () => {
    const name = $('#name-sign-up').val()
    const email = $('#email-sign-up').val()
    const password = $('#password-sign-up').val()

    if (name === '' || email === '' || password === '') {
        const tooltip = $('<p></p>').text(body.success)
        container.append(tooltip)
        return
    }

    const result = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
        }),
    })
    const body = await result.json()
    if (body.success) {
        console.log(body.success)
        const tooltip = $('<p></p>').text(body.success)
        container.append(tooltip)
    } else {
        console.log(body.message)
        const tooltip = $('<p></p>').text(body.message)
        container.append(tooltip)
    }
})

$('#submit-sign-in').click(async () => {
    const email = $('#email-sign-in').val()
    const password = $('#password-sign-in').val()
    let token

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    if (urlParams.has('authToken')) token = urlParams.get('authToken')

    const result = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            token: token,
        }),
    })

    const body = await result.json()
    if (body.success) {
        console.log()
        window.location.href = '/'
    } else {
        console.log(body.message)
    }
})
