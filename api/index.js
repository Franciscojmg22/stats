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
        if(results.length > 0){
          
          bcrypt.compare(password, results[0].aca_password, (err, ex) => {
            if(ex){
              const respuesta = {
                error: '',
                existe: 1,
                id: results[0].aca_id
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




app.listen(3000, () => {
  console.log('server runing on port ', 3000)
})