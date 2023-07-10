// Realizar importaciones
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from 'dotenv'
    // Para acceder a URL de otra página
import cors from 'cors';
    // Para rutas
import routerVeterinarios from './routers/veterinario_routes.js'
    // Para rutas pacientes
import routerPacientes from './routers/paciente_routes.js'


// Inicializaciones
const app = express()
dotenv.config()

//SwaggerUI
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const swaggerSpec={
    definition:{
        openapi: "3.0.0",
        info:{
            title: "Node MongoDB API",
            version: "1.0.0"
        }
    },
    apis: [`${__dirname}/routers/paciente_routes.js`],
};


// Configuraciones 
    //Utilizar el puerto 3000 o uno predeterminada al realizar el despliegue u otras
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
    // Para trabajar con ..JSON
app.use(express.json())

// Variables globales


// Rutas 
    // app.get('/',(req,res)=>{
    //     res.send("Server on")
    // })

app.use('/api',routerVeterinarios)
app.use('/api',routerPacientes)

app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerJSDoc(swaggerSpec)))
    // Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))



// Exportación de la variable app
export default  app
