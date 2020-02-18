const express = require('express');
const app = express();
const Grupo = require('../models/grupo');
const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');

const _ = require('underscore');

const { validateBody, verificaToken, verificaAdminRole } = require('../middlewares/generalValidators');
const { validateIdParams } = require('../middlewares/grupoValidators');

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

app.put('/grupo/:id/integrante', [verificaToken, verificaAdminRole, validateIdParams], (req, res) => {

    const id = req.params.id;
    const id_integrante = req.query.id;

    Grupo.findById(id, (err, grupo) => {

        let integrantes = grupo.integrantes;

        Usuario.findById(id_integrante, (err, usuario) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if ( !usuario ) {
                return res.status(404).json({
                    ok: false,
                    err:{
                        errors:{
                            message: 'El usuario que desea agregar no existe'
                        }
                    }
                });
            }

            let integrante = {
                _id: usuario._id,
                llave: usuario.llave,
                name: usuario.name,
                email: usuario.email,
                username: usuario.username
            };
            
            integrantes.push(integrante);
            
            Grupo.findByIdAndUpdate(id, { integrantes }, { new: true }, (err, newGrupo) => {
                if ( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                return res.json({
                    ok: true,
                    grupo: newGrupo
                });
            });
        });
    });

});

app.put('/grupo', [verificaToken, verificaAdminRole, validateIdParams],(req, res) => {

    const id = req.query.id;

    const body = _.pick(req.body, ['name']); 

    Grupo.findByIdAndUpdate(id, {name: body.name}, {new: true}, (err, grupo) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            grupo
        });
    });
});

app.get('/grupo/integrantes', [verificaToken, validateIdParams], (req, res) => {

    const id = req.query.id;

    Grupo.findById(id, (err, grupo) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !grupo ) {
            return res.status(404).json({
                ok: false,
                err: {
                    errors : {
                        message: `El grupo con el id ${ id } no existe.`
                    }
                }
            });
        }

        return res.status(200).json({
            ok: true,
            integrantes: grupo.integrantes
        });
    });

});

module.exports = app;

