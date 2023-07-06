// npm init --y
// npm i express bcryptjs mongoose dotenv nodemailer jsonwebtoken cors

// npm i nodemon -D: Módulo para el entorno de desarrollo; -D para decir que son dependencias de desarrollo

    // CORS: cuando se quiere realizar una petición a otra URL ..... para la compartición de información
    // 

//Extensión en google para la presentación de formato JSN: JSON view

// Para la encriptación de datos: JWT ; encriptación de datoas al pasar de abacken a forntend



// Importación de la variable app por medio de modulos
import app from './server.js'
import connection from './database.js';

connection()

//Ejecutar el servidor por medio del puerto 3000
app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})
