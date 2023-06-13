const contenedor = document.getElementById('contenedorDatos')

const cardDatos = document.getElementById('cardDatos').content
const regNombre = document.getElementById('regNombre')
const regCategoria = document.getElementById('regCategoria')
const regRama = document.getElementById('regRama')
const regAcciones = document.getElementById('regAcciones')

const intNombre = document.getElementById('intNombre')
const intCategoria = document.getElementById('intCategoria')
const intRama = document.getElementById('selRama')
const btnRegistrar = document.getElementById('btnRegistrar')

const dialog = document.getElementById('dialogRespuesta')
const mensajeDialogo = document.getElementById('mensajeDialog')

const dialogDelete = document.getElementById('dialogDelete')
const dialogDelete_mensaje = document.getElementById('dialogDelete-mensaje')

const deleteCancelar = document.getElementById('deleteCancelar')
const deleteConfirmar = document.getElementById('deleteConfirmar')

const fragment = document.createDocumentFragment()

let equDeleteId

const cargaPanel = (url) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.cache = false
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText
            contenedor.innerHTML = response
        }
    } 
    xhr.send()
}

const desplegarDatos = (datos) => {
    contenedor.innerHTML = ''
    console.log(datos)
    let background = 1
    datos.forEach((equipo) => {
        cardDatos.getElementById('regNombre').textContent = equipo.equ_nombre
        cardDatos.getElementById('regCategoria').textContent = equipo.equ_categoria_min + ' - ' + equipo.equ_categoria_max
        cardDatos.getElementById('regRama').textContent = equipo.equ_rama
        cardDatos.querySelector('.apartados').setAttribute('equ-id', equipo.equ_id)

        const clone = cardDatos.cloneNode(true)
        fragment.appendChild(clone)
        contenedor.appendChild(fragment)

        if (background) {
            contenedor.lastElementChild.classList.add('fondo')
        }
        background ^= 1
    })
}

const validarCategoria = (cadena) => {
    const formato = /^\d{4}-\d{4}$/;
    return formato.test(cadena);
}

const desplegaDialogError = () => {
    dialog.classList.add('error')
    dialog.classList.remove('exito')
    console.log('hola')
    dialog.showModal()
    setTimeout(() => {
        dialog.close()
    }, 1500)
}
const desplegaDialogExito = () => {
    dialog.classList.remove('error')
    dialog.classList.add('exito')
    console.log('hola')
    dialog.showModal()
    setTimeout(() => {
        dialog.close()
    }, 1500)
}

const traeEquipos = () => {
    console.log('entró')
    const datos = {
        academiaId: localStorage.getItem('id')
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/traeEquipos', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                localStorage.setItem('equipos', JSON.stringify(data.datos))
                desplegarDatos(data.datos)
            }
        })
}

window.addEventListener('DOMContentLoaded', () => {
    desplegarDatos(JSON.parse(localStorage.getItem('equipos')))
})

btnRegistrar.addEventListener('click', e => {
    e.preventDefault()
    if (!intNombre.value || !intCategoria.value || !intRama.value) {
        mensajeDialogo.textContent = 'Campos incompletos'
        desplegaDialogError()
        return
    }
    if (!validarCategoria(intCategoria.value)) {
        mensajeDialogo.textContent = 'formato de categoria incorrecto'
        desplegaDialogError()
        return
    }

    const categorias = intCategoria.value.split('-')


    if (parseInt(categorias[0]) > parseInt(categorias[1])) {
        mensajeDialogo.textContent = 'formato de categoria incorrecto'
        desplegaDialogError()
        return
    }
    const datos = {
        acaId: localStorage.getItem('id'),
        nombre: intNombre.value,
        catMinima: parseInt(categorias[0]),
        catMaxima: parseInt(categorias[1]),
        rama: intRama.value
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)

    fetch('http://localhost:3000/registroEquipo', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            console.log('data', data)
            console.log('mensaje', data.mensaje)
            mensajeDialogo.textContent = data.mensaje
            if (data.error) {
                //console.log('### => ', data.mensaje)
                desplegaDialogError()
            } else {
                //console.log('registro => ', data.mensaje)
                traeEquipos()
               desplegaDialogExito()
            }
        })
        
})


contenedor.addEventListener('click', e => {
    e.preventDefault()
    console.log('holaa')
    if (e.target.getAttribute('id') == 'icoDelete') {
        const info = e.target.parentNode.parentNode.parentNode
        equDeleteId = info.getAttribute('equ-id')
        //console.log('e => ', info)
        //console.log('id => ', jugDeleteId)
        dialogDelete_mensaje.textContent = '¿Seguro que quieres eliminar el equipo ' +
            info.querySelectorAll('#regNombre')[0].textContent + '?'
        dialogDelete.showModal()
        return
    }
})

deleteCancelar.addEventListener('click', () => {
    dialogDelete.close()
})

deleteConfirmar.addEventListener('click', () => {
    const datos = {
        equipoId: equDeleteId
    }
    const datosJSON = JSON.stringify(datos)
    console.log(datosJSON)
    fetch('http://localhost:3000/eliminarEquipo', {
        method: 'post',
        body: datosJSON
    }).then(response => response.json())
        .then(data => {
            if (data.error) {
                console.log('### => ', data.mensaje)
            } else {
                console.log('partidos => ', data.datos)
                traeEquipos()
            }
        })
    dialogDelete.close()
})
