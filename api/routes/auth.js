const router = require('express').Router()


router.post('/registro', async(req, res) => {
    let nombre = req.body.academia
    let correo = req.body.correo
    let password = req.body.password
    console.log('@@@ auth => ', nombre, correo)
    try{
        const sql = 'INSERT INTO academia (aca_nombre, aca_correo, aca_password) VALUES (?, ?, ?)'
        conexion.query(sql, [nombre, correo, password], (error, results) => {
            if (error){
                console.log('### error => ', error)
                res.send('entro a if')
            }
            res.send('Datos enviados correctamente')
        })
    }catch(error){
        console.log('@@@ valio madre ')
        res.send('catch')
    }
    console.log('finalizó')
})

module.exports = router