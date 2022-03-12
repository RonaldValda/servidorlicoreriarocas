var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;
const CompraProductoSchema = mongoose.Schema({
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Producto"
    },
    lote:{
        type:String,
        default:""
    },
    fecha_vencimiento:{
        type:String
    },
    cantidad:{
        type:Number,
        default:0
    },
    precio_unitario:{
        type:SchemaTypes.Number
    },
    compra:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Compra"
    }
});
module.exports = mongoose.model('CompraProducto',CompraProductoSchema);