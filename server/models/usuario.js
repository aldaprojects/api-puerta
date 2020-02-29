const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

let usuarioSchma = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'], maxlength: 50 },
    email: { unique: true, type: String, required: [true, 'El correo es necesario'], validate: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ },
    password: { type: String, required: [true, 'La contraseña es obligatoria'], minlength: 5 },
    username: { type: String, required: [true, 'El nombre de usuario es necesario'], minlength: 4 },
    img: { type: String, require: false },
    fecha_registro: { type: Date, require: true },
    llave: { type: Boolean, default: false },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
    grupo: { type: Schema.Types.ObjectId, ref: 'grupo', default: null },
    google: { type: Boolean, default: false }
});

usuarioSchma.methods.toJSON = function() {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;

    return userObject
};

usuarioSchma.plugin( uniqueValidator, { message: 'El correo ya está en uso.' } );

module.exports = mongoose.model( 'usuario', usuarioSchma );

