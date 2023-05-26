const form = document.getElementById('formulario')

form.addEventListener('submit', e => {
    e.preventDefault()
    const correo = document.getElementById('email').value
    const password = document.getElementById('password').value
    const datos = {
        correo: correo,
        password: password
    }
    const datosJSON = JSON.stringify(datos)

    fetch('http://localhost:3000/login', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.err) {
                console.log(data)
            } else if (data.existe) {
                console.log(data.id)
                localStorage.setItem('id', data.id)
                window.location.href = 'panel.html'
            } else {
                console.log('no existe')
            }
        })
})