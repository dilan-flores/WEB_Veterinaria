// Realizar importaciones
import express from 'express'
    // Para el manejo de variables de entorno
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
    // Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))



// Exportación de la variable app
export default  app