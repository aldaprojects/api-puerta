const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { validateBody, verificaToken } = require('../middlewares/generalValidators');
const { validateCrearCuenta, validateActUsuario } = require('../middlewares/usuarioValidators');

app.put('/usuario', [verificaToken, validateActUsuario ] ,(req, res) => {

    const id = req.query.id;
    const body = req.body;

    Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuario) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            usuario
        });
    });

});

app.post('/usuario', [validateBody, validateCrearCuenta], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        username: body.username,
        fecha_registro: body.fecha_registro
    });

    usuario.save( (err, usuario) => {
        if( err ){

            if ( err.errors.email.properties.type === 'user defined' ) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        errors: {
                            email: {
                                message: 'Debe introducir caracteres validos en el email'
                            }
                        }
                    }
                });
            }

            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            usuario
        });
    });
    
});

module.exports = app;