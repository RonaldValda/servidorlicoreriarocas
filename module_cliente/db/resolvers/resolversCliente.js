const Cliente=require('../../models/cliente');
const Venta=require('../../../module_ventas/models/venta');
const ClienteFavorito=require('../../models/clienteFavorito');
const Producto=require('../../../module_productos/models/producto');
const resolversCliente={
    Query:{
        obtenerClientes:async(_,{})=>{
            return await Cliente.find({});
        },
        buscarCliente: async(_,{ci_nit,nombres})=>{
            var filtro={};
            if(ci_nit!=""){
                filtro.ci_nit=ci_nit;
                return await Cliente.find(filtro);
            }
            filtro={ nombres :{ $regex : '.*'+ nombres + '.*' ,$options:'i'}};
            return await Cliente.find(filtro);
        },
        obtenerClienteFavorito:async(_,{})=>{
            return await ClienteFavorito.find();
        }
    },
    Mutation:{
        registrarCliente:async(_,{input})=>{
            const cliente=Cliente(input);
            await cliente.save();
            return cliente;
        },
        registrarFechaNacimientoCliente: async(_,{id,fecha_nacimiento})=>{
            const cliente=await Cliente.findById(id);
            cliente.fecha_nacimiento=fecha_nacimiento;
            await cliente.save();
            return "Registrado";
        },
        modificarCliente:async(_,{id,input})=>{
            await Cliente.findByIdAndUpdate(id,input);
            return "Modificado";
        },
        eliminarCliente:async(_,{id})=>{
            var filtro={};
            filtro.cliente=id;
            const venta=await Venta.findOne(filtro);
            if(venta){
                throw new Error("No se puede eliminar, el cliente ya efectuó compras");
            }
            await Venta.findByIdAndDelete(id);
            return "Eliminado";
        },
        autenticarCliente: async (_,{input}) => {
            const { email, password} = input;
            const existeCliente = await Cliente.findOne({ email });
            let cliente;
            var fecha=new Date();
            if(input.medio_registro=="Creada"){
                if(!existeCliente){
                    throw new Error('El usuario no existe');
                }
                const passwordCorrecto=await bcryptjs.compare(password,existeCliente.password);
                if(!passwordCorrecto){
                    throw new Error('Password Incorrecto');
                }
                if(existeCliente.estado_cuenta==false){
                    throw new Error('Cuenta inactiva, contáctese con el administrador');
                }
                existeCliente.fecha_penultimo_ingreso=existeCliente.fecha_ultimo_ingreso;
                existeCliente.fecha_ultimo_ingreso=fecha;
                await existeCliente.save();
                cliente=await Cliente.findOne({email:input.email});
            }else{
                if(!existeCliente){
                    const nuevoCliente = new Cliente(input);
                    nuevoCliente.fecha_registro=fecha;
                    nuevoCliente.fecha_ultimo_ingreso=fecha;
                    nuevoCliente.fecha_penultimo_ingreso=nuevoCliente.fecha_ultimo_ingreso;
                    await nuevoCliente.save();
                    cliente=nuevoCliente;
                }else{
                    existeCliente.fecha_penultimo_ingreso=existeCliente.fecha_ultimo_ingreso;
                    existeCliente.fecha_ultimo_ingreso=fecha;
                    await existeCliente.save();
                    cliente=await Cliente.findOne({email:input.email});
                }
            }
            return cliente;
        },
        registrarClienteFavorito:async(_,{input})=>{
            var filtro={};
            filtro.producto=input.producto;
            filtro.cliente=input.cliente;
            let clienteFavorito=await ClienteFavorito.findOne(filtro);
            if(!clienteFavorito){
                clienteFavorito=ClienteFavorito(input);
                const producto=await Producto.findById(input.producto);
                producto.clientes_favorito.push(clienteFavorito.id);
                producto.cantidad_favoritos++;
                await clienteFavorito.save();
                await producto.save();
            }else{
                if(clienteFavorito.favorito&&clienteFavorito.favorito!=input.favorito){
                    const producto=await Producto.findById(input.producto);
                    clienteFavorito.favorito=false;
                    producto.cantidad_favoritos--;
                    await clienteFavorito.save();
                    await producto.save();
                }else if(!clienteFavorito.favorito&&clienteFavorito.favorito!=input.favorito){
                    const producto=await Producto.findById(input.producto);
                    clienteFavorito.favorito=true;
                    producto.cantidad_favoritos++;
                    await clienteFavorito.save();
                    await producto.save();
                }
            }
            return clienteFavorito;
        }
    }
}
module.exports=resolversCliente;