;(async function test() {
    const response = await fetch('/api/listings')
    const body = await response.json()
    console.log('Test', body.listings)
})()
