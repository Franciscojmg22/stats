//#region CONSTANTES DE HTML
const selTorneo = document.getElementById('selTorneo')
const selEquipo = document.getElementById('selEquipo')
const btnAplicar = document.getElementById('btnAplicar')

const intTorneo = document.getElementById('intTorneo')
const intEquipo = document.getElementById('intEquipo')
const intFecha = document.getElementById('intFecha')
const etiquetaMarcador = document.getElementById('etiquetaMarcador')
const intRival = document.getElementById('intRival')
const marFav = document.getElementById('intMarFav')
const marCon = document.getElementById('intMarCon')
const btnRegistrar = document.getElementById('btnRegistrar')

const diaPartido = document.querySelectorAll('#diaPartido')[0]
const labTornero = document.getElementById('labTorneo')
const labFecha = document.getElementById('labFecha')
const labMarcador = document.getElementById('labMarcador')

const cardDatos = document.getElementById('cardDatos').content
const contenedor = document.getElementById('contenedorDatos')
const fragment = document.createDocumentFragment()

const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

const dialogNP = document.getElementById('nuevoPartido')

const cardRegistros = document.getElementById('cardRegistros').content
const regContainer = document.getElementById('regStats')

const btnConfirmar = document.getElementById('btnConfirmar')
const btnCancelar = document.getElementById('btnCancelar')

//#endregion 

let partidoId

const formatoFecha = (fecha) => {
    const d = new Date(fecha);

    const dia = d.getDate();
    const mes = d.getMonth() + 1; 
    const anio = d.getFullYear();
    const fechaFormato = `${dia}/${mes}/${anio}`;

    return fechaFormato;
}


const desplegarDatos = (datos) => {
    contenedor.innerHTML = ''
    console.log(datos)
    let background = 1
    datos.forEach((partido) => {
        //cardDatos.getElementById('regEqu').textContent = 'hola'
        cardDatos.getElementById('regEquRiv').textContent = partido.par_rival
        cardDatos.getElementById('regMarFav').textContent = partido.par_mar_fav
        cardDatos.getElementById('regMarCon').textContent = partido.par_mar_con
        cardDatos.getElementById('regFecNac').textContent = formatoFecha(partido.par_fecha)
        //cardDatos.querySelector('.apartados').setAttribute('jug-id', jugadores.jug_id)

        const clone = cardDatos.cloneNode(true)
        fragment.appendChild(clone)
        contenedor.appendChild(fragment)

        if (background) {
            contenedor.lastElementChild.classList.add('fondo')
        }
        background ^= 1
    })
}

const desplegarJugadores = (datos) => {
    regContainer.innerHTML = ''
    let background = 1
    datos.forEach((jugadores) => {
        cardRegistros.getElementById('nrNombre').textContent = jugadores.jug_nombre
        cardRegistros.querySelector('.cardRegistrosC').setAttribute('jugId', jugadores.jug_id)

        const clone = cardRegistros.cloneNode(true)
        fragment.appendChild(clone)
        regContainer.appendChild(fragment)

        if (background) {
            regContainer.lastElementChild.classList.add('fondo')
        }
        background ^= 1
    })
}

const traeJugadores = (equipo, catMin, catMax, rama) => {
    const datos = {
        academiaId: localStorage.getItem('id'),
        equipoId: equipo,
        catMin: catMin,
        catMax: catMax,
        rama: rama
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/traeJugadores', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('jugadores => ', data.datos)
                desplegarJugadores(data.datos)
            }
        })
}

window.addEventListener('DOMContentLoaded', e => {
    e.preventDefault()
    JSON.parse(localStorage.getItem('torneos')).forEach(torneo => {
        //console.log(torneo.tor_nombre)
        const newOption = document.createElement("option")
        newOption.textContent = torneo.tor_nombre
        newOption.setAttribute("torId", torneo.tor_id)
        selTorneo.appendChild(newOption)

        const newOptionInt = document.createElement("option")
        newOptionInt.textContent = torneo.tor_nombre
        newOptionInt.setAttribute("torId", torneo.tor_id)
        intTorneo.appendChild(newOptionInt)
    })

    JSON.parse(localStorage.getItem('equipos')).forEach(equipo => {
        console.log(equipo.equ_nombre)
        const newOption = document.createElement("option")
        const nombre = equipo.equ_nombre + ' (' + equipo.equ_categoria_min + '-' + equipo.equ_categoria_max + ')'
        newOption.textContent = nombre
        newOption.setAttribute("equId", equipo.equ_id)
        newOption.setAttribute("catMin", equipo.equ_categoria_min)
        newOption.setAttribute("catMax", equipo.equ_categoria_max)
        selEquipo.appendChild(newOption)

        const newOptionInt = document.createElement("option")
        newOptionInt.textContent = nombre
        newOptionInt.setAttribute("equId", equipo.equ_id)
        newOptionInt.setAttribute("catMin", equipo.equ_categoria_min)
        newOptionInt.setAttribute("catMax", equipo.equ_categoria_max)
        newOptionInt.setAttribute("rama", equipo.equ_rama)
        intEquipo.appendChild(newOptionInt)
    })

    //dialogNP.showModal()
})

btnAplicar.addEventListener('click', e => {
    e.preventDefault()
    const torneo = selTorneo.selectedOptions[0].getAttribute('torId')
    const equipo = selEquipo.selectedOptions[0].getAttribute('equId')
    

    const datos = {
        academiaId: localStorage.getItem('id'),
        torneoId: torneo,
        equipoId: equipo
    }
    const datosJSON = JSON.stringify(datos)

    fetch('http://localhost:3000/traePartidos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('@@@ => ', data.datos)

                if (data.datos.length == 0) {
                    mensajeDialogo.textContent = 'No existen partidos'
                    dialog.showModal()

                    setTimeout(function () {
                        dialog.close()
                    }, 1200)
                } else {
                    cardDatos.getElementById('regEqu').textContent = selEquipo.value
                    desplegarDatos(data.datos)
                }

                selEquipo.options[0].selected = true
                selTorneo.options[0].selected = true
            }
        })
})

intRival.addEventListener('keyup', e => {
    etiquetaMarcador.textContent = 'Marcador: ' + intEquipo.value.split(' (')[0] + ' vs ' + intRival.value
})

btnRegistrar.addEventListener('click', e => {
    e.preventDefault()
    diaPartido.textContent = intEquipo.value.split(' (')[0] + ' vs ' + intRival.value
    labTornero.textContent = intTorneo.value
    labMarcador.textContent = marFav.value + ' - ' + marCon.value
    labFecha.textContent = formatoFecha(intFecha.value)

    const equipoId = intEquipo.selectedOptions[0].getAttribute('equId')
    const catMin = intEquipo.selectedOptions[0].getAttribute('catMin')
    const catMax = intEquipo.selectedOptions[0].getAttribute('catMax')
    const rama = intEquipo.selectedOptions[0].getAttribute('rama')

    const datos = {
        academiaId: localStorage.getItem('id'),
        equipoId: equipoId,
        torneoId: intTorneo.selectedOptions[0].getAttribute('torId'),
        fecha: intFecha.value,
        rival: intRival.value,
        marFav: marFav.value,
        marCon: marCon.value

    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/registroPartido', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                dialogNP.showModal()
                console.log('datos desde btn => ', catMin)
                console.log('datos desde btn => ', catMax)
                partidoId = data.datos.insertId
                traeJugadores(equipoId, catMin, catMax, rama)
            }
        })






})

btnConfirmar.addEventListener('click', e => {
    e.preventDefault()

    const regj = document.querySelectorAll('.cardRegistrosC')

    regj.forEach((elemento, ind) => {
        console.log('elemento => ', elemento, '!!!!', ind)
        //console.log('elementoconm => ', elemento.content)
        const datos = {
            jugId: elemento.getAttribute('jugId'),
            torId: intTorneo.selectedOptions[0].getAttribute('torId'),
            parId: partidoId,
            tir: document.querySelectorAll('#nrTir')[ind].value.split('/')[0],
            tirCon: document.querySelectorAll('#nrTir')[ind].value.split('/')[1],
            tri: document.querySelectorAll('#nrTri')[ind].value.split('/')[0],
            triCon: document.querySelectorAll('#nrTri')[ind].value.split('/')[1],
            asi: document.querySelectorAll('#nrAsi')[ind].value,
            tap: document.querySelectorAll('#nrTap')[ind].value,
            rob: document.querySelectorAll('#nrRob')[ind].value,
            reb: document.querySelectorAll('#nrReb')[ind].value,
            per: document.querySelectorAll('#nrPer')[ind].value,
            min: document.querySelectorAll('#nrMin')[ind].value

        }

        const datosJSON = JSON.stringify(datos)
        console.log(datosJSON)

        fetch('http://localhost:3000/registroStats', {
            method: 'post',
            body: datosJSON
        }).then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log('### => ', data.mensaje)
                } else {
                    console.log('jugadores => ', data.datos)
                    dialogNP.close()
                }
                dialogNP.close()
            })
    })






})

btnCancelar.addEventListener('click', e => {
    e.preventDefault()

    dialogNP.close()
})
