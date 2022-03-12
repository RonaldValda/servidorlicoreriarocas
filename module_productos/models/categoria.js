const mongoose = require('mongoose');
const CategoriaSchema = mongoose.Schema({
    nombre_categoria:{
        type:String,
        default:""
    },
    subcategorias:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategoria',default:{}
    }],
});
module.exports = mongoose.model('Categoria',CategoriaSchema);