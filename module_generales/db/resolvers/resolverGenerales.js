const ConfiguracionEmpresa=require('../../models/configuracionEmpresa');
const Sucursal=require('../../models/sucursal');
const SucursalAlmacen=require('../../models/sucursalAlmacen');
const ProductoKardex=require('../../../module_productos/models/productoKardexSucursal');
const resolversGenerales={
    Query:{
        obtenerSucursales: async(_,{})=>{
            return await Sucursal.find({});
        },
        obtenerConfiguracionesEmpresa: async(_,{})=>{
            return await ConfiguracionEmpresa.find({});
        },
        obtenerSucursalAlmacenes: async(_,{id_sucursal})=>{
            var filtro={};
            filtro.sucursal=id_sucursal;
            return await SucursalAlmacen.find(filtro).sort({localizacion:1});
        }
    },
    Mutation:{
        registrarConfiguracionEmpresa: async(_,{input})=>{
            var configuracionEmpresa=ConfiguracionEmpresa(input);
            var fecha=new Date();
            configuracionEmpresa.fecha_inicio=fecha;
            configuracionEmpresa.fecha_final=fecha;
            await configuracionEmpresa.save();
            return configuracionEmpresa.save();
        },
        modificarConfiguracionEmpresa:async(_,{id,input})=>{
            var configuracionEmpresa=await ConfiguracionEmpresa.findById(id);
            configuracionEmpresa.moneda_principal=input.moneda_principal;
            configuracionEmpresa.moneda_secundaria=input.moneda_secundaria;
            configuracionEmpresa.cambio_moneda_secundaria_principal=input.cambio_moneda_secundaria_principal;
            configuracionEmpresa.utilidad_minima_general=input.utilidad_minima_general;
            configuracionEmpresa.taza_adicional_general=input.taza_adicional_general;
            configuracionEmpresa.ordenar_categorias_alfabeticamente=input.ordenar_categorias_alfabeticamente;
            configuracionEmpresa.ordenar_subcategorias_alfabeticamente=input.ordenar_subcategorias_alfabeticamente;
            configuracionEmpresa.ordenar_etiquetas_alfabeticamente=input.ordenar_etiquetas_alfabeticamente;
            configuracionEmpresa.monto_maximo_variacion_caja=input.monto_maximo_variacion_caja;
            configuracionEmpresa.estado=input.estado;
            await configuracionEmpresa.save();
            return "Modificado";
        },
        eliminarConfiguracionEmpresa:async(_,{id})=>{
            await ConfiguracionEmpresa.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarSucursal: async(_,{input})=>{
            const sucursal=Sucursal(input);
            var fecha=new Date();
            sucursal.fecha_registro=fecha;
            await sucursal.save();
            return sucursal;
        },
        modificarSucursal:async(_,{id,input})=>{
            const sucursal=await Sucursal.findById(id);
            sucursal.descripcion=input.descripcion;
            sucursal.direccion=input.direccion;
            sucursal.telefonos=input.telefonos;
            sucursal.estado=input.estado;
            sucursal.coordenadas=input.coordenadas;
            await sucursal.save();
            return "Modificado";
        }, 
        eliminarSucursal:async(_,{id})=>{
            const productoKardex=await ProductoKardex.findOne({sucursal:id});
            if(productoKardex){
                throw new Error("Ya se registraron movimientos en la sucursal");
            }
            await Sucursal.findByIdAndDelete(id);
            return "Eliminado";
        },
        registrarSucursalAlmacen:async(_,{id_sucursal,localizacion})=>{
            const sucursalAlmacen=SucursalAlmacen();
            sucursalAlmacen.sucursal=id_sucursal;
            sucursalAlmacen.localizacion=localizacion;
            await sucursalAlmacen.save();
            return sucursalAlmacen;
        },
        modificarSucursalAlmacen:async(_,{id,localizacion})=>{
            const sucursalAlmacen=await SucursalAlmacen.findById(id);
            sucursalAlmacen.localizacion=localizacion;
            await sucursalAlmacen.save();
            return "Modificado";
        },
        eliminarSucursalAlmacen: async(_,{id})=>{
            await SucursalAlmacen.findByIdAndDelete(id);
            return "Eliminado";
        }
    }
}
module.exports=resolversGenerales;