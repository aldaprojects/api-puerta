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

module.exports = {
    validateBody,
    verificaToken
}