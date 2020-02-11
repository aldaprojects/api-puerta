const mongoose = require('mongoose');
const bycript = require('bcryptjs');

let Schema = mongoose.Schema;

let grupoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre del grupo  es necesario'], maxlength: 30 },
    codigo: { type: String, default: `${ bycript.hashSync(name) }`},
    admin_name: { unique: true, type: Object, required: [true, 'El creador del grupo es necesario'] },
    fecha_creacion: { type: Date, required: [true, 'La fecha de creacion es necesaria'] }
});

module.exports = mongoose.model( 'grupo', grupoSchema );
