const express = require('express');
const app = express();
const Usuario = require('../models/usuario');

const { validateBody } = require('../middlewares/generalValidators');

app.get('/api/usuario', (req, res) => {

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

app.put('/api/usuario/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

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

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });

});

app.post('/api/usuario', [validateBody], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        username: body.username,
        fecha_registro: body.fecha_registro
    });

    console.log(usuario);

    usuario.save( (err, usuario) => {
        if( err ){
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