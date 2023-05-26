const form = document.getElementById('formulario')

form.addEventListener('submit', e => {
    e.preventDefault()
    const academia = document.getElementById('academia').value
    const correo = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('passwordConf').value

    if (password === passwordConfirm) {
        const res = {
            academia: academia,
            correo: correo,
            password: password
        }
        const resJSON = JSON.stringify(res)

        fetch('http://localhost:3000/registro', {
            method: 'post',
            body: resJSON
        }).then(x => console.log('hola'))
        console.log(resJSON)
    } else {
        passwordError()
    }


})

const passwordError = () => {
    console.log('contraseñas no coinciden')
}