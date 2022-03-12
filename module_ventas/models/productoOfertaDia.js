var mongoose = require('mongoose');
const ProductoOfertaDiaSchema = mongoose.Schema({
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Producto"
    },
    fecha:{
        type:Date
    },
    activo:{
        type:Boolean,
        default:false
    },
    solo_tienda:{
        type:Boolean,
        default:false
    },
    solo_app:{
        type:Boolean,
        default:false
    },
    tienda_app:{
        type:Boolean,
        default:false
    },
    precio_unitario:{
        type:Number,
        default:0.0
    },
});
module.exports = mongoose.model('ProductoOfertaDia',ProductoOfertaDiaSchema);