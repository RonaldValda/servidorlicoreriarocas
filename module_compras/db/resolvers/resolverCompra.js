const Proveedor=require('../../models/proveedor');
const Compra=require('../../models/compra');
const CompraProducto=require('../../models/compraProducto');
const ProductoKardexSucursal=require('../../../module_productos/models/productoKardexSucursal');
const ProductoLoteSucursal=require('../../../module_productos/models/productoLoteSucursal');
const resolversCompra={
    Query:{
        obtenerProveedores: async(_,{})=>{
            return await Proveedor.find();
        },
        buscarProveedor: async(_,{ci_nit,nombres})=>{
            var filtro={};
            if(ci_nit!=""){
                filtro.ci_nit=ci_nit;
                return await Proveedor.find(filtro);
            }
            filtro={ nombres :{ $regex : '.*'+ nombres + '.*' ,$options:'i'}};
            return await Proveedor.find(filtro);
        },
        obtenerPreComprasPendientes: async(_,{id_sucursal,tipo_usuario_confirmacion})=>{
            var filtro={};
            if(id_sucursal!="") filtro.sucursal=id_sucursal;
            filtro.tipo_usuario_confirmacion=tipo_usuario_confirmacion;
            filtro.confirmado=false;
            return await Compra.find(filtro)
                        .populate({path:"proveedor"})
                        .populate(
                            {
                                path:"compra_productos",
                                populate:{
                                    path:"producto",
                                    populate:{
                                        path:"etiqueta",
                                        populate:{
                                            path:"subcategoria",
                                            populate:{
                                                path:"categoria"
                                            }
                                        }
                                    }
                                }
                            }
                        )
                        .populate({path:"usuario_pre_compra"});
        }
    },
    Mutation:{
        registrarProveedor: async(_,{input})=>{
            const proveedor=Proveedor(input);
            var fecha=new Date();
            proveedor.fecha_registro=fecha;
            await proveedor.save();
            return proveedor;
        },
        modificarProveedor: async(_,{id,input})=>{
            const proveedor=await Proveedor.findById(id);
            proveedor.ci_nit=input.ci_nit;
            proveedor.nombres=input.nombres;
            proveedor.estado=input.estado;
            await proveedor.save();
            return "Modificado";
        },
        eliminarProveedor: async(_,{id})=>{
            var filtro={};
            filtro.proveedor=id;
            const compra=await Compra.findOne(filtro);
            if(compra){
                throw new Error('No se puede eliminar, ya se realizaron compras con el proveedor');
            }
            await Proveedor.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarPreCompra: async(_,{id_sucursal,id_proveedor,id_usuario_pre_compra,tipo_usuario_confirmacion,input,input_compra_productos})=>{
            const compra=Compra(input);
            var fecha=Date();
            compra.sucursal=id_sucursal;
            compra.proveedor=id_proveedor;
            compra.usuario_pre_compra=id_usuario_pre_compra;
            compra.tipo_usuario_confirmacion=tipo_usuario_confirmacion;
            if(input.fecha_pre_compra_movimiento==""){
                compra.fecha_pre_compra_movimiento=fecha;
            }
            compra.fecha_pre_compra_sistema=fecha;
            //await compra.save();
            for(var i=0;i<input_compra_productos.length;i++){
                const compraProducto=CompraProducto(input_compra_productos[i]);
                compraProducto.compra=compra.id;
                await compraProducto.save();
                compra.compra_productos.push(compraProducto.id);
            }
            await compra.save();
            var filtro={};
            filtro.compra=compra.id;
            return await Compra.findById(compra.id)
                        .populate(
                            {
                                path:"compra_productos",
                                popultate:{path:"producto"}
                            }
                        );
        },
        modificarPreCompra: async(_,{id,id_proveedor,input})=>{
            const compra=await Compra.findById(id);
            compra.proveedor=id_proveedor;
            compra.nro_comprobante=input.nro_comprobante;
            compra.observaciones_pre_compra=input.observaciones_pre_compra;
            await compra.save();
            return "Modicado";
        },
        terminarPreCompra: async(_,{id,observaciones_pre_compra})=>{
            const compraProducto=await CompraProducto.findById(id);
            compraProducto.pre_compra_terminada=true;
            compraProducto.observaciones_pre_compra=observaciones_pre_compra;
            await compraProducto.save();
            return "Pre compra terminada";
        },
        registrarCompraProducto: async(_,{id_compra,costo_total,input})=>{
            const compraProducto=CompraProducto(input);
            compraProducto.compra=id_compra;
            const compra=await Compra.findById(id_compra);
            if(!compra){
                throw new Error("No existe la compra");
            }
            compra.compra_productos.push(compraProducto.id);
            compra.costo_total=costo_total;
            await compra.save();
            await compraProducto.save();
            return compraProducto;
        },
        responderConfirmacionPreCompra:async(_,{id_usuario_confirmacion,id_compra,input,input_compra_productos})=>{
            const compra=await Compra.findById(id_compra);
            var fecha=Date();
            compra.usuario_confirmacion=id_usuario_confirmacion;
            compra.costo_total=input.costo_total;
            compra.fecha_confirmacion_sistema=fecha;
            console.log(input.fecha_confirmacion_movimiento);
            if(input.fecha_confirmacion_movimiento=="") compra.fecha_confirmacion_movimiento=fecha;
            compra.confirmado=input.confirmado;
            compra.observaciones_confirmacion=compra.observaciones_confirmacion;
            if(input.confirmado==true){
                for(var i=0;i<input_compra_productos.length;i++){
                    const input_compra_producto=input_compra_productos[i];
                    const compraProducto=await CompraProducto.findById(input_compra_producto.id);
                    compraProducto.lote=input_compra_producto.lote;
                    compraProducto.fecha_vencimiento=input_compra_producto.fecha_vencimiento;
                    compraProducto.precio_unitario=input_compra_producto.precio_unitario;
                    await compraProducto.save();
                    const productoKardexSucursal=ProductoKardexSucursal();
                    productoKardexSucursal.sucursal=compra.sucursal;
                    productoKardexSucursal.usuario=compra.usuario_confirmacion;
                    productoKardexSucursal.producto=compraProducto.producto;
                    productoKardexSucursal.fecha=fecha;
                    productoKardexSucursal.detalle="Entrada";
                    productoKardexSucursal.tipo="Entrada";
                    productoKardexSucursal.nro_comprobante=compra.nro_comprobante;
                    productoKardexSucursal.cantidad=compraProducto.cantidad;
                    productoKardexSucursal.valor=compraProducto.precio_unitario*compraProducto.cantidad;
                    var filtro={};
                    filtro.fecha={$lte:fecha};
                    filtro.producto=compraProducto.producto;
                    filtro.sucursal=compra.sucursal;
                    const productoKardex=await ProductoKardexSucursal.findOne(filtro).sort({fecha:-1});
                    var cantidad_nuevo=compraProducto.cantidad;
                    var precio_unitario_nuevo=compraProducto.precio_unitario;
                    if(productoKardex){
                        var cantidad_saldo_anterior=productoKardex.cantidad;
                        var valor_unitario_anterior=productoKardex.valor_unitario;
                        var valor_unitario=(cantidad_saldo_anterior*valor_unitario_anterior+cantidad_nuevo*precio_unitario_nuevo)/(cantidad_saldo_anterior+cantidad_nuevo);
                        productoKardexSucursal.valor_unitario=valor_unitario;
                        productoKardexSucursal.cantidad_saldo=cantidad_saldo_anterior+cantidad_nuevo;
                        productoKardexSucursal.valor_saldo=productoKardexSucursal.cantidad_saldo*valor_unitario;
                    }else{
                        productoKardexSucursal.valor_unitario=compraProducto.precio_unitario;
                        productoKardexSucursal.cantidad_saldo=compraProducto.cantidad;
                        productoKardexSucursal.valor_saldo=compraProducto.precio_unitario*compraProducto.cantidad;
                        
                    }
                    await productoKardexSucursal.save();
                    filtro={};
                    filtro.producto=compraProducto.producto;
                    filtro.sucursal=compra.sucursal;
                    filtro.lote=compraProducto.lote;
                    let productoLoteSucursal=await ProductoLoteSucursal.findOne(filtro);
                    if(productoLoteSucursal){
                        productoLoteSucursal.cantidad_inicial+=compraProducto.cantidad;
                        productoLoteSucursal.cantidad_saldo+=compraProducto.cantidad;
                    }else{
                        productoLoteSucursal=ProductoLoteSucursal();
                        productoLoteSucursal.sucursal=compra.sucursal;
                        productoLoteSucursal.producto=compraProducto.producto;
                        productoLoteSucursal.lote=compraProducto.lote;
                        productoLoteSucursal.fecha_vencimiento=compraProducto.fecha_vencimiento;
                        productoLoteSucursal.cantidad_inicial=compraProducto.cantidad;
                        productoLoteSucursal.cantidad_saldo=compraProducto.cantidad;
                    }
                    await productoLoteSucursal.save();
                }
            }
            await compra.save();
            return compra;
        }
    }
}
module.exports=resolversCompra;