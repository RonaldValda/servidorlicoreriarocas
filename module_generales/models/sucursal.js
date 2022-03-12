const mongoose = require('mongoose');
const SucursalSchema = mongoose.Schema({
    descripcion:{
        type:String,
        default:""
    },
    direccion:{
        type:String,
        default:""
    },
    fecha_registro:{
        type:Date,
        default:Date.now()
    },
    estado:{
        type:Boolean
    },
    telefonos:[{
        type:String,
        default:{}
    }],
    coordenadas:[{
        type:Number,
        default:{}
    }]
});
module.exports = mongoose.model('Sucursal',SucursalSchema);