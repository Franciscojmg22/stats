const registrar = document.getElementById('btnRegistrar')
const selEquipo = document.getElementById('selEquipo')

const cardDatos = document.getElementById('cardDatos').content
const contenedor = document.getElementById('contenedorDatos')
const fragment = document.createDocumentFragment()

const jugNombre = document.getElementById('jugNombre')
const jugApellido = document.getElementById('jugApellido')
const jugFecNac = document.getElementById('jugFecNac')
const jugRama = document.getElementById('jugRama')
const btnRegistrar = document.getElementById('btnRegistrar')

const cardAcciones = document.getElementById('cardAcciones')

const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

const icoDelete = document.getElementById('#icoDelete')
const icoUpdate = document.querySelectorAll('#icoUpdate')
const dialogUpdate = document.getElementById('dialogUpdate')

const btnActualizar = document.getElementById('btnUpdate')

const dialogDelete = document.getElementById('dialogDelete')
const dialogDelete_mensaje = document.getElementById('dialogDelete-mensaje')

const deleteCancelar = document.getElementById('deleteCancelar')
const deleteConfirmar = document.getElementById('deleteConfirmar')

const updateCancelar = document.getElementById('updateCancelar')
const updateConfirmar = document.getElementById('updateConfirmar')

let jugDeleteId

let equipoActual
let catMinActual
let catMaxActual
let rama

const desplegarDatos = (datos) => {
    contenedor.innerHTML = ''
    console.log(datos)
    let background = 1
    datos.forEach((jugadores) => {
        cardDatos.getElementById('regNom').textContent = jugadores.jug_nombre
        cardDatos.getElementById('regApe').textContent = jugadores.jug_apellido
        cardDatos.getElementById('regFecNac').textContent = formatoFecha(jugadores.jug_fec_nac)
        cardDatos.querySelector('.apartados').setAttribute('jug-id', jugadores.jug_id)

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

function convertirFecha(fecha) {
    var partes = fecha.split('/');
    var dia = parseInt(partes[0], 10);
    var mes = parseInt(partes[1], 10) - 1;
    var anio = parseInt(partes[2], 10);

    return new Date(anio, mes, dia);
}

const traeJugadores = () => {
    console.log('entró')
    const datos = {
        academiaId: localStorage.getItem('id'),
        equipoId: equipoActual,
        catMin: catMinActual,
        catMax: catMaxActual,
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
                console.log('partidos => ', data.datos)
                desplegarDatos(data.datos)
            }
        })
}

btnRegistrar.addEventListener('click', e => {
    e.preventDefault()
    if (!jugNombre.value || !jugApellido.value || !jugFecNac.value || !jugRama.value) {
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
        academiaId: localStorage.getItem('id'),
        nombre: jugNombre.value,
        apellido: jugApellido.value,
        fechaNacimiento: jugFecNac.value,
        rama: jugRama.value
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
 
    fetch('http://localhost:3000/registroJugadores', {
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
                traeJugadores()
            }
            console.log('hola')
            mensajeDialogo.textContent = data.mensaje
            dialog.showModal()
            setTimeout(() => {
                dialog.close()
            }, 1500)
        })

})

window.addEventListener('DOMContentLoaded', () => {
    JSON.parse(localStorage.getItem('equipos')).forEach(equipo => {
        console.log(equipo.equ_nombre)
        const newOption = document.createElement("option")
        newOption.textContent = equipo.equ_nombre + ' (' + equipo.equ_categoria_min + '-' + equipo.equ_categoria_max + ') '
        newOption.setAttribute("equId", equipo.equ_id)
        newOption.setAttribute("catMin", equipo.equ_categoria_min)
        newOption.setAttribute("catMax", equipo.equ_categoria_max)
        newOption.setAttribute("rama", equipo.equ_rama)
        selEquipo.appendChild(newOption)
    })
})



selEquipo.addEventListener('change', e => {
    e.preventDefault()
    equipoActual = selEquipo.selectedOptions[0].getAttribute('equId')
    catMinActual = selEquipo.selectedOptions[0].getAttribute('catMin')
    catMaxActual = selEquipo.selectedOptions[0].getAttribute('catMax')
    rama = selEquipo.selectedOptions[0].getAttribute('rama')

    traeJugadores()
})

contenedor.addEventListener('click', e => {
    e.preventDefault()
    if (e.target.getAttribute('id') == 'icoDelete') {
        const info = e.target.parentNode.parentNode.parentNode
        jugDeleteId = info.getAttribute('jug-id')
        //console.log('e => ', info)
        //console.log('id => ', jugDeleteId)
        dialogDelete_mensaje.textContent = '¿Seguro que quieres eliminar el registro de ' +
            info.querySelectorAll('#regNom')[0].textContent + ' ' +
            info.querySelectorAll('#regApe')[0].textContent + '?'
        dialogDelete.showModal()
        return
    }

    if (e.target.getAttribute('id') == 'icoUpdate') {
        const info = e.target.parentNode.parentNode.parentNode
        jugDeleteId = info.getAttribute('jug-id')
        //console.log('nombreeUU', dialogUpdate.querySelectorAll('#jugNombreU')[0])
        dialogUpdate.querySelectorAll('#jugNombreU')[0].value = info.querySelectorAll('#regNom')[0].textContent
        dialogUpdate.querySelectorAll('#jugApellidoU')[0].value = info.querySelectorAll('#regApe')[0].textContent
        dialogUpdate.querySelectorAll('#jugFecNacU')[0].valueAsDate = convertirFecha(info.querySelectorAll('#regFecNac')[0].textContent)
        console.log('fecha =>', dialogUpdate.querySelectorAll('#jugFecNacU')[0])
        dialogUpdate.showModal()
        return
    }
})

deleteCancelar.addEventListener('click', () => {
    dialogDelete.close()
})

deleteConfirmar.addEventListener('click', () => {
    const datos = {
        jugadorId: jugDeleteId
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/eliminarJugador', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                traeJugadores()
            }
        })
    dialogDelete.close()
})

updateCancelar.addEventListener('click', e => {
    e.preventDefault()
    dialogUpdate.close()
})

updateConfirmar.addEventListener('click', e => {
    e.preventDefault()
    const datos = {
        jugadorId: jugDeleteId,
        nombre: dialogUpdate.querySelectorAll('#jugNombreU')[0].value,
        apellido: dialogUpdate.querySelectorAll('#jugApellidoU')[0].value,
        rama: dialogUpdate.querySelectorAll('#jugRamaU')[0].value,
        fechaNacimiento: dialogUpdate.querySelectorAll('#jugFecNacU')[0].value
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/actualizarJugador', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                traeJugadores()
            }
            dialogUpdate.close()

        })

})

