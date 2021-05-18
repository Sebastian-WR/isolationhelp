;(async function test() {
    const response = await fetch('api/getAll')
    const body = await response.json()
    console.log('Test', body.data)
})()
