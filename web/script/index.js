const btnLogin = document.getElementById('btnLogin')
const btnRegistro = document.getElementById('btnRegistro')

const contenedor = document.getElementById('contenedor')
const tarjetas = document.getElementById('tarjetas').content

const fragment = document.createDocumentFragment()

window.addEventListener('DOMContentLoaded', () => {

    creaCard('./info/estadisticas.txt', './partials/iconos/estadisticas.png')
    creaCard('./info/control.txt', './partials/iconos/evaluacion.png')
    creaCard('./info/equipo.txt', './partials/iconos/grupo.png')
    creaCard('./info/rendimiento.txt', './partials/iconos/rendimiento.png')
})

const creaCard = (url, urlImg) => {
    var tex = 'hola'
    fetch(url)
        .then(response => response.text())
        .then(texto => {
            tarjetas.getElementById('info').textContent = texto
            tarjetas.getElementById('ico').setAttribute('src', urlImg)
            console.log('@@ => ', tarjetas.getElementById('info').textContent)
            const clone = tarjetas.cloneNode(true)
            fragment.appendChild(clone)
            contenedor.appendChild(fragment)
            console.log('acaba crea card')
        })

}

btnLogin.addEventListener('click', e => {
    window.location.href = 'login.html'
})

btnRegistro.addEventListener('click', e => {
    window.location.href = 'registro.html'
})
