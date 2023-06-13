
const btnFiltrar = document.getElementById('btn')
const selTorneo = document.getElementById('secTorneo')
const selPartido = document.getElementById('secPartido')
const selEquipo = document.getElementById('secEquipo')

const cardDatos = document.getElementById('cardDatos').content
const contenedor = document.getElementById('contenedorDatos')
const fragment = document.createDocumentFragment()

const cardAcciones = document.getElementById('cardAcciones')

const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

window.addEventListener('DOMContentLoaded', () => {
    // Obtiene torneos
    const datos = {
        academiaId: localStorage.getItem('id')
    }
    const datosJSON = JSON.stringify(datos)
    fetch('http://localhost:3000/traeTorneos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                //console.log('### => ', data.mensaje)
            } else {
                //console.log('@@@ => ', data.datos)
                localStorage.setItem('torneos', JSON.stringify(data.datos))
            }
        })

    // Obtiene equipos
    fetch('http://localhost:3000/traeEquipos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                //console.log('### => ', data.mensaje)
            } else {
                //console.log('@@@ => ', data.datos)
                localStorage.setItem('equipos', JSON.stringify(data.datos))
            }
        })


    // llenar sections
    JSON.parse(localStorage.getItem('torneos')).forEach(torneo => {
        //console.log(torneo.tor_nombre)
        const newOption = document.createElement("option")
        newOption.textContent = torneo.tor_nombre
        newOption.setAttribute("torId", torneo.tor_id)
        selTorneo.appendChild(newOption)
    })

    JSON.parse(localStorage.getItem('equipos')).forEach(equipo => {
        console.log(equipo.equ_nombre)
        const newOption = document.createElement("option")
        newOption.textContent = equipo.equ_nombre
        newOption.setAttribute("equId", equipo.equ_id)
        newOption.setAttribute("catMin", equipo.equ_categoria_min)
        newOption.setAttribute("catMax", equipo.equ_categoria_max)
        selEquipo.appendChild(newOption)
    })

})

selEquipo.addEventListener('change', () => {
    partidoOptions()
})
selTorneo.addEventListener('change', () => {
    partidoOptions()
})

const partidoOptions = () => {
    while (selPartido.options.length > 1) {
        selPartido.remove(1)
    }

    const datos = {
        academiaId: localStorage.getItem('id'),
        torneoId: selTorneo.selectedOptions[0].getAttribute('torId'),
        equipoId: selEquipo.selectedOptions[0].getAttribute('equId')
    }
    const datosJSON = JSON.stringify(datos)
    //console.log(datosJSON)
    fetch('http://localhost:3000/traePartidos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                //console.log('### => ', data.mensaje)
            } else {
                //console.log('partidos => ', data.datos)
                data.datos.forEach(partido => {
                    //console.log(partido.par_rival)
                    const newOption = document.createElement("option")
                    newOption.textContent = 'vs ' + partido.par_rival
                    newOption.setAttribute("parId", partido.par_id)
                    selPartido.appendChild(newOption)
                })
            }
        })
}


btnFiltrar.addEventListener('click', e => {
    e.preventDefault()
    console.log('entra en btnFiltrar')

    const torneo = selTorneo.selectedOptions[0].getAttribute('torId')
    const equipo = selEquipo.selectedOptions[0].getAttribute('equId')
    const partido = selPartido.selectedOptions[0].getAttribute('parId')



    const datos = {
        academiaId: localStorage.getItem('id'),
        torneoId: torneo,
        equipoId: equipo,
        partidoId: partido,
        catMin: selEquipo.selectedOptions[0].getAttribute('catMin'),
        catMax: selEquipo.selectedOptions[0].getAttribute('catMax')
    }
    const datosJSON = JSON.stringify(datos)

    fetch('http://localhost:3000/traeStats', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('@@@ => ', data.datos)


                if (data.datos.length > 0) {
                    desplegarDatos(data.datos)
                    document.getElementById('cabEquipo').textContent = selEquipo.selectedOptions[0].value
                    document.getElementById('Torneo').textContent = selTorneo.selectedOptions[0].value
                    document.getElementById('vs').textContent = selPartido.selectedOptions[0].value

                } else {
                    mensajeDialogo.textContent = 'No existe registro de partido'
                    dialog.showModal()

                    setTimeout(function () {
                        dialog.close()
                    }, 1200)
                }

                selEquipo.options[0].selected = true
                selPartido.options[0].selected = true
                selTorneo.options[0].selected = true
                while(selPartido.options.length > 1){
                    selPartido.remove(1)
                }

            }
        })


    //console.log('btn => ', torneo)
})

const desplegarDatos = (datos) => {
    contenedor.innerHTML = ''
    //console.log(datos)
    let background = 1
    datos.forEach((stats) => {
        cardDatos.getElementById('Nombre').textContent = stats.jug_nombre
        cardDatos.getElementById('regTir').textContent = stats.jst_conv_campo + '/' + stats.jst_tiro_campo
        cardDatos.getElementById('regTri').textContent = stats.jst_conv_triple + '/' + stats.jst_tiro_triple
        cardDatos.getElementById('regAsi').textContent = stats.jst_asistencias
        cardDatos.getElementById('regTap').textContent = stats.jst_tapones
        cardDatos.getElementById('regReb').textContent = stats.jst_rebotes
        cardDatos.getElementById('regRob').textContent = stats.jst_robos
        cardDatos.getElementById('regPer').textContent = stats.jst_perdidas
        cardDatos.getElementById('regMin').textContent = stats.jst_minutos



        const clone = cardDatos.cloneNode(true)
        fragment.appendChild(clone)
        contenedor.appendChild(fragment)

        if (background) {
            contenedor.lastElementChild.style.backgroundColor = 'rgb(255,198,66)'
        }
        background ^= 1
    })
}

