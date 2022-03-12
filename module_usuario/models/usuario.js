const mongoose = require('mongoose');
const UsuarioSchema = mongoose.Schema({
    link_foto:{
        type:String,
        default:""
    },
    nombres: {
        type: String,
        trim: true
    },
    apellidos:{
        type: String
    },
    imei_telefono:{
        type:String,
        trim:true,
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    },
    medio_registro:{
        type: String,
        required: true,
        trim:true
    },
    fecha_registro: {
        type: Date,
        default: Date.now()
    },
    tipo_usuario:{
        type: String,
    },
    telefono: {
        type: String,
        trim: true
    },
    fecha_ultimo_ingreso: {
        type: Date,
        default:Date.now()
    },
    fecha_penultimo_ingreso: {
        type: Date,
        default:Date.now()
    },
    estado_cuenta:{
        type: Boolean
    }
});
module.exports = mongoose.model('Usuario',UsuarioSchema);