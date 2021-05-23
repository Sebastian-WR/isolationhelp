async function test() {
    const response = await fetch('/api/tasks')
    const body = await response.json()
    console.log('Test', body.tasks)
}
