const btnLogin = document.getElementById('btnLogin')
const btnRegistro = document.getElementById('btnRegistro')

btnLogin.addEventListener('click', e => {
    window.location.href = 'login.html'
})

btnRegistro.addEventListener('click', e => {
    window.location.href = 'registro.html'
})