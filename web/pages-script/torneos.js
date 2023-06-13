const contenedor = document.getElementById('contenedorDatos')
const nombre = document.getElementById('regNombre')
const fecha = document.getElementById('regFec')
const lugar = document.getElementById('regLug')
const cardDatos = document.getElementById('cardDatos').content
const fragment = document.createDocumentFragment()

const btnNuevoTorneo = document.getElementById('btnRegistrar')
const torNombre = document.getElementById('torNombre')
const torLugar = document.getElementById('torLugar')
const torFecha = document.getElementById('torFecha')

const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

const dialogDelete = document.getElementById('dialogDelete')
const dialogDelete_mensaje = document.getElementById('dialogDelete-mensaje')

const deleteCancelar = document.getElementById('deleteCancelar')
const deleteConfirmar = document.getElementById('deleteConfirmar')

let torDeleteId

const desplegarDatos = (datos) => {
    contenedor.innerHTML = ''
    console.log(datos)
    let background = 1
    datos.forEach((torneo) => {
        cardDatos.getElementById('regNom').textContent = torneo.tor_nombre
        cardDatos.getElementById('regFec').textContent = formatoFecha(torneo.tor_fecha)
        cardDatos.getElementById('regLug').textContent = torneo.tor_lugar
        cardDatos.querySelector('.apartados').setAttribute('tor-id', torneo.tor_id)

        const clone = cardDatos.cloneNode(true)
        fragment.appendChild(clone)
        contenedor.appendChild(fragment)

        if (background) {
            contenedor.lastElementChild.classList.add('fondo')
        }
        background ^= 1
    })
}

const formatoFecha = (fecha) => {
    const d = new Date(fecha);

    const dia = d.getDate();
    const mes = d.getMonth() + 1; 
    const anio = d.getFullYear();
    const fechaFormato = `${dia}/${mes}/${anio}`;

    return fechaFormato;
}

const traeTorneo = () => {
    console.log('entró')
    const datos = {
        academiaId: localStorage.getItem('id')
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/traeTorneos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                localStorage.setItem('torneos', JSON.stringify(data.datos))
                desplegarDatos(data.datos)
            }
        })
}

window.addEventListener('DOMContentLoaded', e => {
    e.preventDefault()
    desplegarDatos(JSON.parse(localStorage.getItem('torneos')))
})


contenedor.addEventListener('click', e => {
    e.preventDefault()
    if (e.target.getAttribute('id') == 'icoDelete') {
        const info = e.target.parentNode.parentNode.parentNode
        torDeleteId = info.getAttribute('tor-id')
        //console.log('e => ', info)
        //console.log('id => ', jugDeleteId)
        dialogDelete_mensaje.textContent = '¿Seguro que quieres eliminar el equipo ' +
            info.querySelectorAll('#regNom')[0].textContent + '?'
        dialogDelete.showModal()
        return
    }
})

deleteCancelar.addEventListener('click', () => {
    dialogDelete.close()
})

deleteConfirmar.addEventListener('click', () => {
    const datos = {
        torneoId: torDeleteId
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/eliminarTorneo', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                traeTorneo()
            }
        })
    dialogDelete.close()
})

btnNuevoTorneo.addEventListener('click', e => {
    e.preventDefault()

    if (!torNombre.value || !torLugar.value || !torFecha.value) {
        dialog.classList.remove('exito')
        dialog.classList.add('error')
        mensajeDialogo.textContent = 'Campos incompletos'
        dialog.showModal()

        setTimeout(() => {
            dialog.close()
        }, 1500)
        return
    }
    const datos = {
        aca_id: '7',//localStorage.getItem('id'),
        nombre: torNombre.value,
        lugar: torLugar.value,
        fecha: torFecha.value
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)

    fetch('http://localhost:3000/registroTorneo', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                //console.log('### => ', data.mensaje)
                dialog.classList.remove('exito')
                dialog.classList.add('error')
            } else {
                //console.log('registro => ', data.mensaje)
                dialog.classList.remove('error')
                dialog.classList.add('exito')


                const datosTor = {
                    academiaId: localStorage.getItem('id')
                }
                const datosTorJSON = JSON.stringify(datosTor)
                fetch('http://localhost:3000/traeTorneos', {
                    method: 'post',
                    body: datosTorJSON
                }).then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            //console.log('### => ', data.mensaje)
                        } else {
                            localStorage.setItem('torneos', JSON.stringify(data.datos))
                            desplegarDatos(data.datos)
                        }
                    })


            }
            mensajeDialogo.textContent = data.mensaje
            dialog.showModal()
            setTimeout(() => {
                dialog.close()
            }, 1500)
        })

})
