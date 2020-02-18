const jwt = require('jsonwebtoken');

let validateBody = ( req, res, next ) => {

    let body = req.body;

    if ( Object.keys(body).length > 0 ) {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            errors: {
                message: 'El body no debe estar vacio'
            }
        });
    }

}

const verificaToken = ( req, res, next ) => {

    const token = req.get('token')
    
    jwt.verify( token, 'seed', (err, decoded) => {
        if( err ){
            return res.status(401).json({
                ok : false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }

        req.usuario = decoded.usuario;

        next();
    })

};

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        res.status(401).json({
            ok: false,
            err: {
                errors: {
                    message: 'Necesita ser administrador'
                }
            }
        });
    }

}

let validateIdParams = (req, res, next) => {
    let id = req.query.id;

    if ( !id ) {
        return res.status(400).json({
            ok: false,
            err: {
                errors: {
                    message: 'Debe introducir el id como parametro'
                }
            }
        })
    }

    next();
}

module.exports = {
    validateBody,
    verificaToken,
    verificaAdminRole,
    validateIdParams
}