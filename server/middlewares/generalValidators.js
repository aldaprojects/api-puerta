let validateBody = ( req, res, next ) => {

    let body = req.body;

    if ( body != undefined || !body) {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            errors: {
                message: 'El body no debe estar vacio'
            }
        })
    }

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
            errors
        });
    }

    next();
}

module.exports = {
    validateBody ,
    validateBodyLogin
}