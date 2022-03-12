const { ApolloServer,gql }=require('apollo-server');
const jwt=require('jsonwebtoken');
require('dotenv').config('variables.env');

const resolversUsuario=require('./module_usuario/db/resolvers/resolverUsuario');
const resolversGenerales=require('./module_generales/db/resolvers/resolverGenerales');
const resolversProducto=require('./module_productos/db/resolvers/resolverProducto');
const resolversCompra=require('./module_compras/db/resolvers/resolverCompra');
const pathSchemaGenerales='./module_generales/db/schema/schemaGenerales.graphql';
const pathSchemaProducto='./module_productos/db/schema/schemaProducto.graphql';
const pathSchemaCompra='./module_compras/db/schema/schemaCompra.graphql';
const pathSchemaUsuario='./module_usuario/db/schema/schemausuario.graphql';
const pathSchemaVenta='./module_ventas/db/schema/schemaVenta.graphql';
const resolversVenta=require('./module_ventas/db/resolvers/resolversVenta');
const resolversCliente=require('./module_cliente/db/resolvers/resolversCliente');
const pathSchemaCliente='./module_cliente/db/schema/schemaCliente.graphql';

const conectarDB=require('./config/db')
const fs=require('fs')


//conectar a la base de datos
conectarDB();
const server=new ApolloServer({
    typeDefs:[
        gql(fs.readFileSync(pathSchemaUsuario,'utf8')),
        gql(fs.readFileSync(pathSchemaGenerales,'utf8')),
        gql(fs.readFileSync(pathSchemaProducto,'utf8')),
        gql(fs.readFileSync(pathSchemaCompra,'utf8')),
        gql(fs.readFileSync(pathSchemaVenta,'utf-8')),
        gql(fs.readFileSync(pathSchemaCliente,'utf-8'))
    ],
    resolvers:[resolversUsuario,resolversGenerales,resolversProducto,resolversCompra,resolversVenta,resolversCliente],
    context: ({req})=>{
        const token = req.headers['authorization']||'';
        if(token){
            try{
                const usuario = jwt.verify(token,process.env.SECRETA);
                return {
                    usuario
                }
            }catch(error){

            }
        }
    },
    playground: true,
    introspection: true,
});
/*server.listen().then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`);
})*/
server.listen({port:process.env.PORT||4000}).then(({url})=>{
    console.log(`Servidor listo en la URL ${url}`);
});