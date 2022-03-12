
const Usuario = require('../../models/usuario');
const bcryptjs = require('bcryptjs');
const resolversUsuario={
    Query:{
       obtenerUsuarios: async(_,{})=>{
           var filtro={};
           filtro.tipo_usuario={$nin:"Gerente"};
           const usuarios=Usuario.find(filtro);
           return usuarios;
       }
    },
    Mutation:{
        registrarUsuario: async(_,{input})=>{
            const usuario=Usuario(input);
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(input.password,salt);
            usuario.password=input.password;
            var fecha=Date();
            usuario.fecha_registro=fecha;
            await usuario.save();
            return usuario;
        },
        modificarUsuario: async(_,{id,input})=>{
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(input.password,salt);
            await Usuario.findByIdAndUpdate(id,input);
            return "Modificado";
        },
        eliminarUsuario: async(_,{id})=>{

            return "Eliminado";
        },
        autenticarUsuario: async(_,{email,password,medio_registro})=>{
            const existeUsuario = await Usuario.findOne({ email });
            var fecha=new Date();
            if(medio_registro=="Creada"){
                if(!existeUsuario){
                    throw new Error("El usuario no existe");
                }
                const passwordCorrecto=await bcryptjs.compare(password,existeUsuario.password);
                if(!passwordCorrecto){
                    throw new Error('Password Incorrecto');
                }
                if(existeUsuario.estado_cuenta==false){
                    throw new Error('Cuenta inactiva, contáctese con el administrador');
                }
                existeUsuario.fecha_penultimo_ingreso=existeUsuario.fecha_ultimo_ingreso;
                existeUsuario.fecha_ultimo_ingreso=fecha;
                await existeUsuario.save();
                return existeUsuario;
            }
            return existeUsuario;
        }
    }
}
module.exports=resolversUsuario;