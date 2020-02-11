const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

const { validateBody, validateBodyLogin } = require('../middlewares/generalValidators');

app.post('/api/login', [validateBody, validateBodyLogin], (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuario)=> {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !usuario ) {
            return res.status(404).json({
                ok: false,
                errors: {
                    message: 'Datos incorrectos, usuario no encontrado'
                }
            });
        }

        if( !bcrypt.compareSync(body.password, usuario.password) ){
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'Correo o contraseña invalido'
                }
            });
        }

        return res.status(200).json({
            ok: true,
            usuario
        });
    });

});

module.exports = app;
