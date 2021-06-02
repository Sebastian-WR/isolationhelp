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
async function test() {
    const response = await fetch('/api/tasks')
    const body = await response.json()
    console.log('Test', body.tasks)
}
