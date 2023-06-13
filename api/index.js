const express = require('express')
const path = require('path')
const cors = require('cors')
const mysql = require('mysql');
const authRoutes = require('./routes/auth.js')
const bcrypt = require('bcrypt')

const app = express()


//#region USE 
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(express.urlencoded({
  extenden: true
})
)

app.use(express.json({
  type: "*/*"
})
)
app.use(cors(corsOptions))

app.use('/api/user', authRoutes)
//#endregion


//#region CONEXION A BDD
// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'stats',
}

// Crear una conexión a la base de datos
const conexion = mysql.createConnection(dbConfig)

// Conectar a la base de datos
/*
conexion.connect(error => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error)
  } else {
    console.log('Conexión exitosa a la base de datos.')
  }
})
*/
//#endregion


app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname + '/front/index.html'))
  console.log('backend activo')
})


app.post('/registro', async (req, res) => {
  const nombre = req.body.academia
  const correo = req.body.correo
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  try {
    // revisa si existe ya registro
    const sql = 'SELECT * FROM academia WHERE aca_correo = ?'
    conexion.query(sql, [correo], (error, results, fills) => {
      if (error) {
        res.send(error)
      } else {
        if (results.length > 0) {
          res.send('Registro existente')
        } else {
          // Comienza a insertar registro
          const sql = 'INSERT INTO academia (aca_nombre, aca_correo, aca_password) VALUES (?, ?, ?)'
          conexion.query(sql, [nombre, correo, password], (error) => {
            if (error) {
              res.send('error al insertar datos')
            } else {
              res.send('Datos enviados correctamente')
            }
          })
        }
      }
    })
  } catch (error) {
    res.send(error)
  }
})


app.post('/login', async (req, res) => {
  const correo = req.body.correo
  const password = req.body.password

  try {
    const sql = 'SELECT * FROM academia WHERE aca_correo = ?'

    conexion.query(sql, [correo], (err, results) => {
      if (err) {
        const respuesta = {
          error: err
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        if (results.length > 0) {

          bcrypt.compare(password, results[0].aca_password, (err, ex) => {
            if (ex) {
              const respuesta = {
                error: '',
                existe: 1,
                id: results[0].aca_id,
                academia: results[0].aca_nombre
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            } else {
              const respuesta = {
                error: '',
                existe: 0,
                id: ''
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            }

          })

        } else {
          const respuesta = {
            error: '',
            existe: 0,
            id: ''
          }
          const respuestaJSON = JSON.stringify(respuesta)
          res.send(respuestaJSON)
        }

      }
    })


  } catch (err) {
    const respuesta = {
      error: err
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)

  }
})

app.post('/registroJugadores', async (req, res) => {
  const academiaId = req.body.academiaId
  const nombre = req.body.nombre
  const apellido = req.body.apellido
  const fechaNacimiento = req.body.fechaNacimiento
  const rama = req.body.rama
  console.log(nombre, apellido, fechaNacimiento, rama)

  try {
    // revisa si existe ya registro
    const sql = 'SELECT * FROM jugadores WHERE jug_nombre = ? AND jug_apellido = ? AND jug_fec_nac = ?'
    conexion.query(sql, [nombre, apellido, fechaNacimiento], (error, results, fills) => {
      if (error) {
        const respuesta = {
          error: 1,
          mensaje: error,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        if (results.length > 0) {
          const respuesta = {
            error: 1,
            mensaje: 'registro existente',
            datos: ''
          }
          const respuestaJSON = JSON.stringify(respuesta)
          res.send(respuestaJSON)
        } else {
          // Comienza a insertar registro
          const sql = 'INSERT INTO jugadores (jug_aca_id, jug_nombre, jug_apellido, jug_fec_nac, jug_rama) VALUES (?, ?, ?, ?, ?)'
          conexion.query(sql, [academiaId, nombre, apellido, fechaNacimiento, rama], (err, result) => {
            if (err) {
              const respuesta = {
                error: 1,
                mensaje: err,
                datos: ''
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            } else {
              const respuesta = {
                error: 0,
                mensaje: 'Registro exitoso',
                datos: result
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            }
          })
        }
      }
    })
  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.post('/registroEquipo', async (req, res) => {
  const acaId = req.body.acaId
  const nombre = req.body.nombre
  const catMinima = req.body.catMinima
  const catMaxima = req.body.catMaxima
  const rama = req.body.rama

  try {
    // revisa si existe ya registro
    const sql = 'SELECT * FROM equipos WHERE equ_aca_id = ? AND equ_categoria_min = ? AND equ_categoria_max = ? AND equ_nombre = ? AND equ_rama = ?'
    conexion.query(sql, [acaId, catMinima, catMaxima, nombre, rama], (error, results, fills) => {
      if (error) {
        const respuesta = {
          error: 1,
          mensaje: error,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        if (results.length > 0) {
          const respuesta = {
            error: 1,
            mensaje: 'registro existente',
            datos: ''
          }
          const respuestaJSON = JSON.stringify(respuesta)
          res.send(respuestaJSON)
        } else {
          // Comienza a insertar registro
          const sql = 'INSERT INTO equipos (equ_aca_id, equ_nombre, equ_categoria_min, equ_categoria_max, equ_rama) VALUES (?, ?, ?, ?, ?)'
          conexion.query(sql, [acaId, nombre, catMinima, catMaxima, rama], (err, result) => {
            if (err) {
              const respuesta = {
                error: 1,
                mensaje: err,
                datos: ''
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            } else {
              const respuesta = {
                error: 0,
                mensaje: 'Registro exitoso',
                datos: result
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            }
          })
        }
      }
    })
  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})


app.post('/registroTorneo', async (req, res) => {
  const aca_id = req.body.aca_id
  const nombre = req.body.nombre
  const lugar = req.body.lugar
  const fecha = req.body.fecha

  try {
    const sql = 'SELECT * FROM torneo WHERE tor_aca_id = ? AND  tor_nombre = ? AND tor_fecha = ?'
    conexion.query(sql, [aca_id, nombre, fecha], (error, resultados, fills) => {
      if (error) {
        const respuesta = {
          error: 1,
          mensaje: error,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {

        if (resultados.length > 0) {
          const respuesta = {
            error: 1,
            mensaje: 'datos repetidos',
            datos: ''
          }
          const respuestaJSON = JSON.stringify(respuesta)
          res.send(respuestaJSON)

        } else {
          const sql = 'INSERT INTO torneo (tor_aca_id, tor_nombre, tor_fecha, tor_lugar) VALUES (?, ?, ?, ?)'

          conexion.query(sql, [aca_id, nombre, fecha, lugar], (err, result) => {
            if (err) {
              const respuesta = {
                error: 1,
                mensaje: err,
                datos: ''
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            } else {
              const respuesta = {
                error: 0,
                mensaje: 'registro realizado',
                datos: result
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            }
          })
        }

      }

    })


  } catch (err) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.post('/registroPartido', async (req, res) => {
  const academiaId = req.body.academiaId
  const equipoId = req.body.equipoId
  const torneoId = req.body.torneoId
  const fecha = req.body.fecha

  const riv = req.body.rival
  const marFav = req.body.marFav
  const marCon = req.body.marCon

  try {
    const sql = 'SELECT * FROM partidos WHERE par_aca_id = ? AND par_equ_id = ? AND par_tor_id = ? AND par_fecha = ?'

    conexion.query(sql, [academiaId, equipoId, torneoId, fecha], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        if (response.length > 0) {
          const respuesta = {
            error: 1,
            mensaje: 'datos repetidos',
            datos: ''
          }
          const respuestaJSON = JSON.stringify(respuesta)
          res.send(respuestaJSON)

        } else {
          const sql = 'INSERT INTO partidos VALUES (?, ?, ?, ?, ?, ?, ?, ?)'

          conexion.query(sql, ['', academiaId, torneoId, equipoId, fecha, riv, marFav, marCon], (er, result) => {
            if (er) {
              const respuesta = {
                error: 1,
                mensaje: er,
                datos: ''
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            } else {
              const respuesta = {
                error: 0,
                mensaje: 'registro realizado',
                datos: result
              }
              const respuestaJSON = JSON.stringify(respuesta)
              res.send(respuestaJSON)
            }
          })
        }
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/registroStats', async (req, res) => {

  const jugId = req.body.jugId
  const torId = req.body.torId
  const parId = req.body.parId
  const tir = req.body.tir
  const tirCon = req.body.tirCon
  const tri = req.body.tri
  const triCon = req.body.triCon
  const asi = req.body.asi
  const tap = req.body.tap
  const rob = req.body.rob
  const reb = req.body.reb
  const per = req.body.per
  const min = req.body.mind



  try {
    const sql = 'INSERT INTO jugstats VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)'
    conexion.query(sql, [jugId, torId, parId, tir, tirCon, tri, triCon, asi, tap, rob, reb, per, min], (error, resultados, fills) => {
      if (error) {
        const respuesta = {
          error: 1,
          mensaje: error,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {

        const respuesta = {
          error: 0,
          mensaje: 'registro realizado',
          datos: result
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    }


    )


  } catch (err) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.post('/traeTorneos', async (req, res) => {
  const academiaId = req.body.academiaId

  try {
    const sql = 'SELECT * FROM torneo WHERE tor_aca_id = ?'

    conexion.query(sql, [academiaId], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'exito',
          datos: response
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/traeEquipos', async (req, res) => {
  const academiaId = req.body.academiaId

  try {
    const sql = 'SELECT * FROM equipos WHERE equ_aca_id = ?'

    conexion.query(sql, [academiaId], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'exito',
          datos: response
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/traePartidos', async (req, res) => {
  const academiaId = req.body.academiaId
  const equipoId = req.body.equipoId
  const torneoId = req.body.torneoId

  try {
    const sql = 'SELECT * FROM partidos WHERE par_aca_id = ? AND par_equ_id = ? AND par_tor_id = ?'

    conexion.query(sql, [academiaId, equipoId, torneoId], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'exito',
          datos: response
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/traeStats', async (req, res) => {
  const academiaId = req.body.academiaId
  const torneoId = req.body.torneoId
  const equipoId = req.body.equipoId
  const partidoId = req.body.partidoId
  const catMin = req.body.catMin
  const catMax = req.body.catMax

  try {
    const sql = `SELECT jugadores.jug_nombre, jugstats.jst_tiro_campo, jugstats.jst_tiro_campo, jugstats.jst_conv_campo, jugstats.jst_tiro_triple, jugstats.jst_conv_triple, jugstats.jst_asistencias, jugstats.jst_rebotes, jugstats.jst_tapones, jugstats.jst_robos, jugstats.jst_minutos, jugstats.jst_perdidas FROM jugstats INNER JOIN jugadores ON jugadores.jug_id = jugstats.jst_jug_id WHERE (jugstats.jst_par_id = ? OR ? = '*') AND YEAR(jugadores.jug_fec_nac) >= ? AND YEAR(jugadores.jug_fec_nac) <= ?`
    //const sql = `SELECT * FROM jugstats WHERE jst_aca_id = ? AND jst_tor_id = ? AND jst_equ_id AND (jst_par_id = ? OR ? = '*')`
    conexion.query(sql, [partidoId, partidoId, catMin, catMax], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'exito',
          datos: response
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/traeJugadores', async (req, res) => {
  const academiaId = req.body.academiaId
  const catMin = req.body.catMin
  const catMax = req.body.catMax
  const rama = req.body.rama

  try {
    const sql = 'SELECT * FROM jugadores WHERE jug_aca_id = ? AND jug_rama = ? AND YEAR(jug_fec_nac) >= ? AND YEAR(jug_fec_nac) <= ?'

    conexion.query(sql, [academiaId, rama, catMin, catMax], (err, response) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'exito',
          datos: response
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/actualizarJugador', async (req, res) => {
  const jugadorId = req.body.jugadorId
  const nombre = req.body.nombre
  const apellido = req.body.apellido
  const fechaNacimiento = req.body.fechaNacimiento
  const rama = req.body.rama
  console.log(nombre, apellido, fechaNacimiento, rama)

  try {
    const sql = 'UPDATE jugadores SET jug_nombre = ?, jug_apellido = ?, jug_fec_nac = ? , jug_rama = ?  WHERE jug_id = ?'
    conexion.query(sql, [nombre, apellido, fechaNacimiento, rama, jugadorId], (err, result) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'Registro exitoso',
          datos: result
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })

  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})


app.post('/eliminarJugador', async (req, res) => {
  const jugadorId = req.body.jugadorId

  try {
    const sql = 'DELETE FROM jugadores WHERE jug_id = ?'
    conexion.query(sql, [jugadorId], (err, result) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'Registro exitoso',
          datos: result
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })

  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.post('/eliminarEquipo', async (req, res) => {
  const equipoId = req.body.equipoId

  try {
    const sql = 'DELETE FROM equipos WHERE equ_id = ?'
    conexion.query(sql, [equipoId], (err, result) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'Se ha eliminado correctamente',
          datos: result
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })

  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.post('/eliminarTorneo', async (req, res) => {
  const torneoId = req.body.torneoId

  try {
    const sql = 'DELETE FROM torneo WHERE tor_id = ?'
    conexion.query(sql, [torneoId], (err, result) => {
      if (err) {
        const respuesta = {
          error: 1,
          mensaje: err,
          datos: ''
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      } else {
        const respuesta = {
          error: 0,
          mensaje: 'Se ha eliminado correctamente',
          datos: result
        }
        const respuestaJSON = JSON.stringify(respuesta)
        res.send(respuestaJSON)
      }
    })

  } catch (error) {
    const respuesta = {
      error: 1,
      mensaje: error,
      datos: ''
    }
    const respuestaJSON = JSON.stringify(respuesta)
    res.send(respuestaJSON)
  }
})

app.listen(3000, () => {
  console.log('server runing on port ', 3000)
})