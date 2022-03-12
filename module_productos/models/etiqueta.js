const mongoose = require('mongoose');
const EtiquetaSchema = mongoose.Schema({
    nombre_etiqueta:{
        type:String,
        default:""
    },
    subcategoria:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategoria'
    },
    productos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Producto',default:{}
    }],
});
module.exports = mongoose.model('Etiqueta',EtiquetaSchema);