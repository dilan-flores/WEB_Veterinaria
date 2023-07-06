// Importación de la función router por parte de express
import {Router} from 'express'
//Inicializar la función en la variable router
const router = Router()

import verificarAutenticacion from '../middlewares/autenticacion.js'


// Definición de rutas

import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
} from "../controllers/veterinario_controller.js";

// Rutas públicas
router.post("/login", login);
router.post("/registro", registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/veterinarios", listarVeterinarios);
router.get("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

// Rutas privadas
router.get('/perfil',verificarAutenticacion,perfil)
router.put('/veterinario/actualizarpassword',verificarAutenticacion,actualizarPassword)
router.get('/veterinario/:id',verificarAutenticacion,detalleVeterinario)
router.put('/veterinario/:id',verificarAutenticacion,actualizarPerfil)


// Exportar la variable router
export default router