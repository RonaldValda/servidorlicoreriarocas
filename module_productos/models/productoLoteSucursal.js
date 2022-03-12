const mongoose = require('mongoose');
const ProductoLoteSucursalSchema = mongoose.Schema({
    sucursal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sucursal'
    },
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Producto'
    },
    lote:{
        type:String
    },
    fecha_vencimiento:{
        type:String,
    },
    cantidad_inicial:{
        type:Number
    },
    cantidad_saldo:{
        type:Number
    },
    producto_lote_sucursal_almacenes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ProductoLoteSucursalAlmacen'
    }],
});
module.exports = mongoose.model('ProductoLoteSucursal',ProductoLoteSucursalSchema);