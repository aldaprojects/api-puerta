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
    validateIdParams
}