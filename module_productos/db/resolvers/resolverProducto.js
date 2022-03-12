const Categoria=require('../../models/categoria');
const Subcategoria=require('../../models/subcategoria');
const Etiqueta=require('../../models/etiqueta');
const Producto=require('../../models/producto');
const ProductoKardexSucursal=require('../../models/productoKardexSucursal');
const ProductoLoteSucursal=require('../../models/productoLoteSucursal');
const ProductoLoteSucursalAlmacen=require('../../models/productoLoteSucursalAlmacen');
const producto = require('../../models/producto');
const resolversProducto={
    Query:{
        obtenerCategorias: async(_,{})=>{
            return await Categoria.find({})
            .populate({path:"subcategorias",populate:{
                path:"etiquetas"
            }});
        },
        obtenerSubcategorias:async(_,{})=>{
            return await Subcategoria.find({});            ;
        },
        obtenerProductosGeneral: async(_,{})=>{
            var filtro={};
            return await Producto.find({})
            .populate({
                path:"etiqueta",
                populate:{
                    path:"subcategoria",
                    populate:{
                        path:"categoria"
                    }
                }
            });
        },
        obtenerProductos: async(_,{id_etiqueta})=>{
            var filtro={};
            filtro.etiqueta=id_etiqueta;
            return await Producto.find(filtro);
        },
        buscarProductoContenido: async(_,{contenido})=>{
            var filtro={};
            //filtro.contenido=contenido;
            filtro={ contenido :{ $regex : '.*'+ contenido + '.*' ,$options:'i'}};
            const productos=await Producto.find(filtro)
                            .populate({
                                path:"etiqueta",
                                populate:{
                                    path:"subcategoria",
                                    populate:{
                                        path:"categoria"
                                    }
                                }
                            });
            return productos;
        },
        obtenerProductoKardexs: async(_,{id_sucursal,id_producto,fecha_inicial,fecha_final})=>{
            var filtro={};
            filtro.sucursal=id_sucursal;
            filtro.producto=id_producto;
            filtro.fecha={$gte:fecha_inicial,$lte:fecha_final};
            return await ProductoKardexSucursal.find(filtro)
                    .populate({
                        path:"usuario"
                    })
        },
        obtenerProductoLotesSucursal: async(_,{id_sucursal,id_producto})=>{
            var filtro={};
            filtro.sucursal=id_sucursal;
            filtro.producto=id_producto;
            filtro.cantidad_saldo={$gte:0};
            /*const productoLotes=await ProductoLoteSucursal.find(filtro).sort({fecha_vencimiento:1});
            
            //console.log(productoLotes.length);
            var requerido=5;
            var cantidadInventario=0;
            var i=0;
            var map=new Map();
            for(var j=0;j<productoLotes.length;j++){
                cantidadInventario+=productoLotes[j].cantidad_inicial;
                break;
            }
            cantidadInventario=0;
            for(var j=0;j<productoLotes.length;j++){
                cantidadInventario+=productoLotes[j].cantidad_inicial;
                if(cantidadInventario>=requerido){
                    console.log(cantidadInventario);
                    break;
                }
                
            }*/
            
            /*productoLotes.sort(
                function(a,b){
                    if(!map.get(a.id)){
                        map.set(a.id,1);
                        i++;
                        cantidadInventario+=a.cantidad_inicial;
                    }

                    if(!map.get(b.id)){
                        map.set(b.id,1);
                        i++;
                        cantidadInventario+=b.cantidad_inicial;
                    }
                    var fechaA=a.fecha_vencimiento.substring(6,10)+"-"+a.fecha_vencimiento.substring(3,5)+"-"+a.fecha_vencimiento.substring(0,2);
                    var fechaB=b.fecha_vencimiento.substring(6,10)+"-"+b.fecha_vencimiento.substring(3,5)+"-"+b.fecha_vencimiento.substring(0,2);
                    var dateA = new Date(fechaA).getTime();
                    var dateB = new Date(fechaB).getTime();
                    return dateB < dateA ? 1 : -1;  
                    //console.log(a.fecha_vencimiento);
                    //Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
                }
            );*/
            //console.log(cantidadInventario);
            const productoLotes=await ProductoLoteSucursal.addFields({
                cantidad_salida:{$divide:["$cantidad_saldo",100]}
            });
            return productoLotes;
        },
        obtenerProductos1:async(_,{})=>{
            const producto = await Producto.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "productos",
                            localField: "producto",
                            foreignField: "_id",
                            as: "producto_lote_sucursal"
                        }
                    },
                    {$unwind: "$producto"},
                    //{$match:{tipo_contrato:"Venta",tipo_inmueble:"Casa"}}

                ]
            )
            //await resultado.Inmueble.find({"sin_hipoteca":true});
            console.log(producto);
            return producto;
        }
    },
    Mutation:{
        registrarMuchasCategorias: async(_,{input})=>{
            input.forEach((item) => {
                console.log(item.nombre_categoria);
            });
            return "Ok";
        },
        registrarCategoria: async(_,{nombre_categoria})=>{
            const categoria=Categoria();
            categoria.nombre_categoria=nombre_categoria;
            await categoria.save();
            return categoria;
        },
        modificarCategoria: async(_,{id,nombre_categoria})=>{
            const categoria=await Categoria.findById(id);
            categoria.nombre_categoria=nombre_categoria;
            await categoria.save();
            return "Modificado";
        },
        eliminarCategoria: async(_,{id})=>{
            await Categoria.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarSubcategoria: async(_,{id_categoria,nombre_subcategoria})=>{
            const subcategoria=Subcategoria();
            subcategoria.categoria=id_categoria;
            subcategoria.nombre_subcategoria=nombre_subcategoria;
            const categoria=await Categoria.findById(id_categoria);
            categoria.subcategorias.push(subcategoria.id);
            await categoria.save();
            await subcategoria.save();
            return subcategoria;
        },
        modificarSubcategoria: async(_,{id,nombre_subcategoria})=>{
            const subcategoria=await Subcategoria.findById(id);
            subcategoria.nombre_subcategoria=nombre_subcategoria;
            await subcategoria.save();
            return "Modificado";
        },
        eliminarSubcategoria: async(_,{id})=>{
            await Subcategoria.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarEtiqueta:async(_,{id_subcategoria,nombre_etiqueta})=>{
            const etiqueta=Etiqueta();
            etiqueta.subcategoria=id_subcategoria;
            etiqueta.nombre_etiqueta=nombre_etiqueta;
            const subcategoria=await Subcategoria.findById(id_subcategoria);
            subcategoria.etiquetas.push(etiqueta.id);
            await subcategoria.save();
            await etiqueta.save();
            return etiqueta;
        },
        modificarEtiqueta:async(_,{id,nombre_etiqueta})=>{
            const etiqueta=await Etiqueta.findById(id);
            etiqueta.nombre_etiqueta=nombre_etiqueta;
            await etiqueta.save();
        },
        eliminarEtiqueta:async(_,{id})=>{
            const producto=await Producto.findOne({etiqueta:id});
            if(producto){
                throw new Error("No se puede eliminar existe productos registrados con la etiqueta");
            }
            const etiqueta=await Etiqueta.findById(id);
            await Etiqueta.findByIdAndDelete(id);
            const subcategoria=await Subcategoria.findById(etiqueta.subcategoria);
            subcategoria.etiquetas.pull(id);
            await subcategoria.save();
            return "Eliminado";
        },
        registrarProducto: async(_,{input})=>{
            const producto=Producto(input);
            await producto.save();
            return producto;
        },
        modificarProducto: async(_,{id,input})=>{
            const producto=await Producto.findById(id);
            producto.codigo=input.codigo;
            producto.unidad=input.unidad;
            producto.contenido=input.contenido;
            producto.precio=input.precio;
            producto.grado_alcoholico=input.grado_alcoholico;
            producto.vencimiento_maximo=input.vencimiento_maximo;
            producto.stock_minimo=input.stock_minimo;
            producto.utilidad=input.utilidad;
            producto.imagenes_producto=input.imagenes_producto;
            await producto.save();
        },
        eliminarProducto: async(_,{id})=>{
            var filtro={};
            filtro.producto=id;
            console.log(id);
            const productoKardexSucursal=await ProductoKardexSucursal.findOne(filtro);
            if(productoKardexSucursal){
                throw new Error ("No se puede eliminar, el producto ya fue registrado en el kardex");
            }
            await Producto.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarProductoLoteSucursal: async(_,{input})=>{
            const productoLoteSucursal=ProductoLoteSucursal(input);
            await productoLoteSucursal.save();
            return productoLoteSucursal;
        },
        registrarProductoKardexSucursal: async(_,{input})=>{
            const productoKardexSucursal=ProductoKardexSucursal(input);
            var fecha=Date();
            productoKardexSucursal.fecha=fecha;
            productoKardexSucursal.valor=input.valor_unitario*input.cantidad;
            var filtro={};
            filtro.producto=input.producto;
            filtro.sucursal=input.sucursal;
            filtro.fecha={$lte:input.fecha};
            const productoKardexSucursalAnterior=await ProductoKardexSucursal.findOne(filtro).sort({fecha:1});
            var cantidad_saldo_anterior=productoKardexSucursalAnterior.cantidad_saldo;
            var valor_saldo_anterior=productoKardexSucursalAnterior.valor_saldo;
            productoKardexSucursal.cantidad_saldo=cantidad_saldo_anterior+input.cantidad;
            productoKardexSucursal.valor_saldo=productoKardexSucursal.cantidad_saldo*input.valor_unitario;
            filtro={};
            filtro.producto=input.producto;
            filtro.sucursal=input.sucursal;
            filtro.lote=input.lote;
            const productoLoteSucursal=await ProductoLoteSucursal.find(filtro);
            if(productoLoteSucursal){
                productoLoteSucursal.cantidad_inicial+=input.cantidad;
            }else{
                productoLoteSucursal=ProductoLoteSucursal();
                productoLoteSucursal.producto=input.producto;
                productoLoteSucursal.sucursal=input.sucursal;
                productoLoteSucursal.lote=input.lote;
                productoLoteSucursal.cantidad_inicial=input.cantidad;
            }
            await productoLoteSucursal.save();
            await productoKardexSucursal.save();
        },
        registrarMasivoProductos: async(_,{id_etiqueta,grado_alcoholico_min,grado_alcoholico_max})=>{
            var cantidad=Math.floor(Math.random() * (20  - 0)) + 10;;
            var imagenes=[
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2FDiferentes-tipos-de-botellas-de-vino-segu%CC%81n-su-forma.jpg?alt=media&token=6eebd0cb-7d49-4342-a29b-04a7a16dc75b",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_azul_guindo.jpg?alt=media&token=c9de3831-3efe-431b-a95d-ca3352f1c734",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_cafe.jpg?alt=media&token=08ab2a10-c78d-45ab-8519-53118ddab381",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_celeste_2.jpg?alt=media&token=e416f4bb-b2c0-4749-aaa9-574069e9654c",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_guindo-2.jpg?alt=media&token=50a6b82c-46f3-46d9-858c-85d456a23200",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_guindo.jpg?alt=media&token=4284b385-82cf-409d-9a2c-fcd9d3e45fd4",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_guindo_cafe.jpg?alt=media&token=9f5d9e30-d418-4532-82be-cda6b626c19c",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_naranja.jpg?alt=media&token=31484192-ede1-4545-8597-7359adf3e075",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_rosado.jpg?alt=media&token=cf077f5a-5d01-4364-9ecd-3f6db3c2901b",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_verde_claro.jpg?alt=media&token=ad60adbd-17fd-466a-9313-fa6778570eb1",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_verde_lechuga.jpg?alt=media&token=cbe3b4c3-e7fc-46af-b4a2-48fabbb1246b",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotella_verde_oscuro.jpg?alt=media&token=e939f72b-19f8-4f5c-8251-fafe1d972bce",
                "https://firebasestorage.googleapis.com/v0/b/bd-inmobiliaria-v01.appspot.com/o/images%2Fdata%2Fuser%2F0%2Fcom.nextlevel.licoreriarocasapp%2Fcache%2Fbotellaceleste.jpg?alt=media&token=3fead734-98bc-47e7-9fbf-076c173fb51b"
            ];
            var valores_booleanos=[true,false,false];
            for(var i=0;i<cantidad;i++){
                const producto=Producto();
                //Math.floor(Math.random() * (tipo_inmueble.length  - 0)) + 0;
                var numero_aleatorio=Math.floor(Math.random() * (100000  - 0)) + 0;
                producto.unidad="Botella";
                producto.contenido="Producto "+numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (20  - 0)) + 8;
                producto.precio=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (30  - 0)) + 20;
                producto.stock_minimo=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (15  - 0)) + 10;
                producto.utilidad=numero_aleatorio;
                numero_aleatorio=Math.floor(Math.random() * (90  - 0)) + 20;
                producto.vencimiento_maximo=numero_aleatorio;
                producto.grado_alcoholico=0;
                if(grado_alcoholico_max>0){
                    numero_aleatorio=Math.floor(Math.random() * (grado_alcoholico_max  - grado_alcoholico_min)) + grado_alcoholico_min;
                    producto.grado_alcoholico=numero_aleatorio;
                }
                var fecha=new Date();
                producto.fecha_registro=fecha;
                numero_aleatorio=Math.floor(Math.random() * (50  - 0)) + 0;
                producto.cantidad_favoritos=numero_aleatorio;
    
                producto.etiqueta=id_etiqueta;
                numero_aleatorio=Math.floor(Math.random() * (imagenes.length  - 0)) + 0;
                producto.imagenes_producto.push(imagenes[numero_aleatorio]);
                await producto.save();
            }
            return "Registrado";
        }
    },
    
}
module.exports=resolversProducto;