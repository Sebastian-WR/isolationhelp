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
    const error = $('#signup-error')
    if (body.success) {
        error.text('Congrats! check your email')
    } else {
        error.text(body.message)
    }
})

$('#submit-sign-in').click(async () => {
    const email = $('#email-sign-in').val()
    const password = $('#password-sign-in').val()
    let token

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    if (urlParams.has('authToken')) token = urlParams.get('authToken')
    try {
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
        console.log(result)
        const body = await result.json()
        console.log(body)
        const error = $('#signin-error')
        if (body.success) {
            window.location.href = '/'
        } else {
            error.text(body.message)
        }
    } catch (error) {
        console.log(error)
    }
})
