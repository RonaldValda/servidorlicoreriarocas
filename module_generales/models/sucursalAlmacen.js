const mongoose = require('mongoose');
const SucursalAlmacenSchema = mongoose.Schema({
    localizacion:{
        type:String
    },
    sucursal:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Sucursal'
    },
});
module.exports = mongoose.model('SucursalAlmacen',SucursalAlmacenSchema);