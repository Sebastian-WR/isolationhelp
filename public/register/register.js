$('#signUp').click(() => {
    $('#container').addClass('right-panel-active')
})

$('#signIn').click(() => {
    $('#container').removeClass('right-panel-active')
})

$('#submit-sign-up').click(async () => {
    const name = $('#name-sign-up').text()
    const email = $('#email-sign-up').text()
    const password = $('#password-sign-up').text()

    const result = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    })
    const body = await result.json()
    console.log(body)
})
