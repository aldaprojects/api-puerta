const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const { validateBody } = require('../middlewares/generalValidators');
const { validateBodyLogin } = require('../middlewares/usuarioValidators');

app.post('/login', [validateBody, validateBodyLogin], (req, res) => {

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

        const token = jwt.sign( { usuario }, 'seed', { expiresIn: '1h' });

        return res.status(200).json({
            ok: true,
            usuario,
            token
        });
    });

});

module.exports = app;
