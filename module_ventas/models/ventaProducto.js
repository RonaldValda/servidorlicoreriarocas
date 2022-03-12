var mongoose = require('mongoose');
const VentaProductoSchema = mongoose.Schema({
    producto_lote:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductoLoteSucursal"
    },
    cantidad:{
        type:Number,
        default:0
    },
    costo_unitario:{
        type:Number,
        default:0.0
    },
    precio_unitario:{
        type:Number,
        default:0.0
    },
    venta:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Venta"
    }
});
module.exports = mongoose.model('VentaProducto',VentaProductoSchema);