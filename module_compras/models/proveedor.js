const mongoose = require('mongoose');
const ProveedorSchema = mongoose.Schema({
    ci_nit:{
        type:String,
        default:""
    },
    nombres:{
        type:String,
        default:""
    },
    fecha_registro:{
        type:Date,
        default:Date.now()
    },
    estado:{
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model('Proveedor',ProveedorSchema);