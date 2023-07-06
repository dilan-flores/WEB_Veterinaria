//Importación de KWT
import jwt from 'jsonwebtoken'
// IMportación del modelo
import Veterinario from '../models/Veterinario.js'

// Definir la función para validar el JWT
const verificarAutenticacion = async (req,res,next)=>{
    // Validación de JWT
    // Si no existe la autorización
    if(!req.headers.authorization) return res.status(404).json({msg:"Lo sentimos, debes proprocionar un token"})    
        const {authorization} = req.headers
    // Obtener el KWT
    try {
        // Obtener solo el token y verificar el mismo
        const {id} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        // Obtner el usaurio en base al ID
        req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
        // Valor de siguiente 
        next()
    } catch (error) {
        // Mandar mensaje de error
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }
}

//Exportar la función
export default verificarAutenticacion