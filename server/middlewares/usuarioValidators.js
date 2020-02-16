const bycript = require('bcryptjs');

let validateCrearCuenta = ( req, res, next ) => {
    
    let body = req.body;
    let errors = [];

    if ( !body.name ) {
        errors.push(`Debe incluir el campo 'name'`);
    }
    if ( !body.email ) {
        errors.push(`Debe incluir el campo 'email'`);
    }
    if ( !body.password ) {
        errors.push(`Debe incluir el campo 'password'`);
    }
    if ( !body.username ) {
        errors.push(`Debe incluir el campo 'username'`);
    }
    if ( !body.fecha_registro ) {
        errors.push(`Debe incluir el campo 'fecha_registro'`);
    }

    if ( errors.length > 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                errors
            }
        });
    }

    next();
}

let validateBodyLogin = ( req, res, next ) => {
    
    let body = req.body;
    let errors = [];

    if ( !body.email ) {
        errors.push(`Debe incluir el campo 'email'`);
    }
    if ( !body.password ) {
        errors.push(`Debe incluir el campo 'password'`);
    }

    if ( errors.length > 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                errors
            }
        });
    }

    next();
}

let validateActUsuario = (req, res, next) => {

    const body = req.body;

    if ( !req.query.id ) {
        return res.status(400).json({
            ok: false,
            err: {
                errors: {
                    message: 'Debe introducir el id como parametro'
                }
            }
        });
    }

    if ( body.email || body.img || body.fecha_registro || body.llave || body.role || body.grupo || body.google ) {
        return res.status(401).json({
            ok: false,
            err: {
                errors: {
                    message: `Solamente puede actualizar los campos 'name', 'password', 'username'`
                }
            }
        });
    }

    if ( body.password ) {
        body.password = bycript.hashSync(body.password, 10);
    }

    next();
}

module.exports = {
    validateBodyLogin,
    validateCrearCuenta,
    validateActUsuario
}