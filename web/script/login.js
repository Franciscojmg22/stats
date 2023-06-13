const form = document.getElementById('formulario')
const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

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
                localStorage.setItem('academia', data.academia)
                
                dialog.classList.remove('error')
                dialog.classList.add('exito')
                mensajeDialogo.textContent = 'Bienvenido'
                dialog.showModal()
                setTimeout(() => {
                    window.location.href = './pages/home.html'
                }, 500)
            } else {
                dialog.classList.remove('exito')
                dialog.classList.add('error')
                mensajeDialogo.textContent = 'Error de correo o contraseña'
                dialog.showModal()
                setTimeout(() => {
                    dialog.close()
                }, 1300)
            }

        })
})