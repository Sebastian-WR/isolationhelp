function formSubmit(form) {
    document.getElementById('success').innerText = 'Success! \nYou created a new task'
    setTimeout(function() {
        form.submit();
    }, 3000)
    return false
}