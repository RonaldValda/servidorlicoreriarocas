const mongoose=require('mongoose');
require('dotenv').config({ path: 'variables.env' });
const DB_MONGO=process.env.DB_MONGO;
const conectarDB=async()=>{
    try{
        await mongoose.connect("mongodb+srv://FranzReynaldo98:abcdef1209@cluster0.rrrof.mongodb.net/rocasBD",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false,
            useCreateIndex:true,
        });
    }catch(error){
        console.log('Hubo error');
        console.log(error);
        process.exit(1);//detener la app
    }
}
module.exports=conectarDB;