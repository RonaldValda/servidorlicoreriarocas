var mongoose = require('mongoose');
const ClienteFavoritoSchema = mongoose.Schema({
    producto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Producto'
    },
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cliente'
    },
    favorito:{
        type:Boolean,
        default:false
    }
});
module.exports = mongoose.model('ClienteFavorito',ClienteFavoritoSchema);