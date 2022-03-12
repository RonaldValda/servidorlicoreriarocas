const mongoose = require('mongoose');
const SubcategoriaSchema = mongoose.Schema({
    nombre_subcategoria:{
        type:String,
        default:""
    },
    categoria:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Categoria'
    },
    etiquetas:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Etiqueta',default:{}
    }],
});
module.exports = mongoose.model('Subcategoria',SubcategoriaSchema);