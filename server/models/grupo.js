const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let grupoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre del grupo  es necesario'], maxlength: 30 },
    codigo: { type: String, required: true, unique: true},
    admin: { unique: true, type: Schema.Types.ObjectId, ref: 'usuario', required: [true, 'El creador del grupo es necesario'] },
    fecha_creacion: { type: Date, required: [true, 'La fecha de creacion es necesaria'] },
    integrantes: { type: Array }
});

module.exports = mongoose.model( 'grupo', grupoSchema );
