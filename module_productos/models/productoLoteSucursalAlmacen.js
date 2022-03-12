const mongoose = require('mongoose');
const ProductoLoteSucursalAlmacenSchema = mongoose.Schema({
    producto_lote_sucursal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ProductoLoteSucursal'
    },
    cantidad_inicial:{
        type:Number
    },
    cantidad_salida:{
        type:Number
    },
    cantidad_saldo:{
        type:Number
    }
});
module.exports = mongoose.model('ProductoLoteSucursalAlmacen',ProductoLoteSucursalAlmacenSchema);