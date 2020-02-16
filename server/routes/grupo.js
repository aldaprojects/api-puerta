const express = require('express');
const app = express();
const Grupo = require('../models/grupo');
const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');

const { validateBody, verificaToken } = require('../middlewares/generalValidators');

app.post('/grupo', [verificaToken, validateBody], (req, res) => {
    
    const body = req.body;

    const grupo = new Grupo({
        name: body.name,
        codigo: bycript.hashSync(body.name, 10).substr(55, 5).toUpperCase(),
        admin: body.id_admin,
        fecha_creacion: body.fecha_creacion
    });

    grupo.save( {new: true}, (err, grupo) => {
        if ( err ) {
            return res.status(500).json({
                ok: false, 
                err
            });
        }

        let nuevoUsuario = {
            role: 'ADMIN_ROLE',
            llave: true,
            grupo: grupo._id
        }

        Usuario.findByIdAndUpdate(body.id_admin, nuevoUsuario,{ new: true } ,(err, usuario) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return res.status(200).json({
                ok: true,
                grupo,
                admin: usuario
            });
        });

    })

});

module.exports = app;