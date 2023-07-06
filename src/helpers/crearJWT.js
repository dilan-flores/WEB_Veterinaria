// Importación de JWT
import jwt from "jsonwebtoken";
// DEFINIR LA FUNCIÓN PARA GENERAR EL TOKEN
const generarJWT = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"})
}
// Exportación por default de la función
export default  generarJWT