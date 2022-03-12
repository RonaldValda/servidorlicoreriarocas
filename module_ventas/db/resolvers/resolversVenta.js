const Venta=require('../../models/venta');
const VentaProducto=require('../../models/ventaProducto');
const ProductoOfertaDia=require('../../models/productoOfertaDia');
const Producto=require('../../../module_productos/models/producto');
const Categoria=require('../../../module_productos/models/categoria');
const resolversVenta={
    Query:{
        obtenerProductosOfertadosHoy:async(_,{})=>{
            var filtro={};
            var fecha=new Date();
            fecha.setHours(0,0,0,0);
            filtro.fecha=fecha;
            filtro.activo=true;
            //console.log(filtro);
            return await ProductoOfertaDia.find(filtro);
        },
        obtenerProductosOfertadosDia:async(_,{fecha})=>{
            var filtro={};
            filtro.fecha=fecha;
            filtro.activo=true;
            return await ProductoOfertaDia.find(filtro);
        },
        obtenerProductoOfertaDia:async(_,{producto,fecha})=>{
            var fechas=new Date(fecha);
            var filtro={};
            filtro.producto=producto;
            filtro.fecha=fecha;
            //console.log(fecha);
            return await ProductoOfertaDia.findOne(filtro)
                            .populate({path:"producto"});
        },
        obtenerProductosVentaCliente:async(_,{id_cliente})=>{
            var filtro={};
            var fecha=new Date();
            fecha.setHours(0,0,0,0);//para poner la hora del dia a las 00:00:00, porque la oferta del dia empieza a media noche
            filtro.fecha=fecha;
            filtro.activo=true;
            
            var resultado={};
            resultado.productos_oferta_dia=await ProductoOfertaDia.find(filtro)
                                                .populate({
                                                    path:"producto"
                                                });
            filtro={};
            if(id_cliente!=""){
                filtro.cliente=id_cliente;
            }else{
                filtro.cliente=null;
            }
            resultado.productos=await Producto.find()
                                .populate({
                                    path:"etiqueta",
                                    populate:{
                                        path:"subcategoria",
                                        populate:{
                                            path:"categoria"
                                        }
                                    }
                                })
                                .populate({
                                    path:"clientes_favorito",match:filtro
                                });
            resultado.categorias=await Categoria.find({});   
            return resultado;
        }
    },
    Mutation:{
        registrarProductoOfertaDia:async(_,{input})=>{
            var filtro={};
            filtro.producto=input.producto;
            filtro.fecha=input.fecha;
            const existeOferta=await ProductoOfertaDia.findOne(filtro);
            if(existeOferta){
                throw new Error("Ya se registró la oferta del día del producto");
            }
            const productoOfertaDia=ProductoOfertaDia(input);
            await productoOfertaDia.save();
            return productoOfertaDia;
        },
        modificarProductoOfertaDia:async(_,{id,input})=>{
            await ProductoOfertaDia.findByIdAndUpdate(id,input);
            return "Modificado";
        },
        eliminarProductoOfertaDia:async(_,{id})=>{
            await ProductoOfertaDia.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarVenta:async(_,{input_venta,input_venta_producto})=>{
            const venta=Venta(input_venta);
            var fecha=new Date();
            input_venta.fecha_venta_sistema=fecha;
            if(input_venta.fecha_venta_movimiento!=""){
                venta.fecha_venta_movimiento=input_venta.fecha_venta_movimiento;
            }
            
        }
    }
}
module.exports=resolversVenta;