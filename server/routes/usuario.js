const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const { validateBody, verificaToken } = require('../middlewares/generalValidators');

app.get('/usuario', verificaToken, (req, res) => {

    Usuario.find({})
    .exec( (err, usuarios) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        Usuario.countDocuments({}, (err, conteo) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                usuarios,
                total: conteo
            });
        });

    });
});

app.put('/usuario/:id', verificaToken ,(req, res) => {

    const id = req.params.id;
    const body = req.body;

    Usuario.findByIdAndUpdate()

    Usuario.findById( id, (err, usuario) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'El usuario con el id' + id + ' no existe'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            return res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});

app.delete('/usuario/:id', verificaToken, (req, res) => {
    const id = req.params.id;
    
    Usuario.findByIdAndDelete(id, (err, usuario) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: err
            });
        }
        
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'El usuario con el id' + id + ' no existe'
                }
            });
        }
        
        return res.status(200).json({
            ok: true,
            usuario
        });
    });
});

app.post('/usuario', validateBody, (req, res) => {

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

            console.log(err.errors.email);

            if ( err.errors.email.properties.type === 'user defined' ) {

                console.log(err.errors.email.properties);

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