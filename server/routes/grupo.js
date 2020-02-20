const express = require('express');
const app = express();
const Grupo = require('../models/grupo');
const Usuario = require('../models/usuario');
const bycript = require('bcryptjs');

const _ = require('underscore');

const { validateBody, verificaToken, verificaAdminRole, validateIdParams } = require('../middlewares/generalValidators');

app.post('/grupo', [verificaToken, validateBody], (req, res) => {
    
    const body = req.body;

    const grupo = new Grupo({
        name: body.name,
        codigo: bycript.hashSync(body.name, 10).substr(55, 5).toUpperCase(),
        admin: req.usuario._id,
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

        Usuario.findByIdAndUpdate(req.usuario._id, nuevoUsuario,{ new: true } ,(err, usuario) => {
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

app.delete('/grupo/:id/integrantes', [verificaToken, verificaAdminRole, validateIdParams], (req, res) => {

    const id_grupo = req.params.id;
    const id_integrante = req.query.id;

    Grupo.findById(id_grupo, (err, grupo) => {

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
                    errors: {
                        message: `El grupo con el id ${ id_grupo } no existe.`
                    }
                }
            });
        }

        let integrantes = grupo.integrantes;

        let encontro = false;

        for (let i = 0; i < integrantes.length; i++) {
            if ( integrantes[i]._id == id_integrante ) {
                encontro = true;
                integrantes.splice(i, 1);
            }
        }

        if ( !encontro ){
            return res.status(404).json({
                ok: false,
                err: {
                    errors: {
                        message: `El usuario con el id ${ id_integrante } no existe.`
                    }
                }
            });
        } else {
            grupo.integrantes = integrantes;

            grupo.save( (err, grupo ) => {
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
        }

    });

});

module.exports = app;

