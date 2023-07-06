// Importar el modelo veterinario
import Veterinario from "../models/Veterinario.js"
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";


const login = async(req,res)=>{
        // Capturar los datos del requests
    const {email,password} = req.body
        // Validación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        // Obtener el usuario en base a email
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        // Validación de la cuenta del email
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
        // Validar si existe el usuario
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
        // Verificar si el password del request es el mismo de la BDD
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    
    const token = generarJWT(veterinarioBDD._id)

        // Desustructurar la informacipon del usuario; mandar solo algunos campos
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
        // Presentación de datos
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id, // una opción 
        email:veterinarioBDD.email // segunda opción
    })
}
const perfil =(req,res)=>{
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v
    res.status(200).json(req.veterinarioBDD)
}
const registro = async (req,res)=>{
        //Capturar los datos del body de la petición
    const {email,password} = req.body
        //Validación de los compos vacíos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        // Validación de existencia del mail
    const verificarEmailBDD = await Veterinario.findOne({email})

    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        // Crear la instancia del modelo
    const nuevoVeterinario = new Veterinario(req.body)
        // Encriptar el password del usuario
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
        // Crear el token del usuario
    nuevoVeterinario.crearToken()

        // Crear el token del usuario
    const token = nuevoVeterinario.crearToken()
        // Invocar la función para el envío del correo
    await sendMailToUser(email,token)
        // Guardar en la base de datos 
    await nuevoVeterinario.save()
        // Enviar la respuesta
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}
const confirmEmail = async (req,res)=>{
        // Validar el token del correo
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        // Verificar si en base a ltoken existe ese usuario
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
        // Validar si el token ya fue seteado al null
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
        // Setear a null el token 
    veterinarioBDD.token = null
        // cambiar a true la configuración de la cuenta
    veterinarioBDD.confirmEmail=true
        // Guardar cambios en BDD
    await veterinarioBDD.save()
        // Presentar mensajes al usuario
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}
const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}
const detalleVeterinario = async(req,res)=>{
        // Obtener datos del request params
    const {id} = req.params
        // validar el id
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
        // Obtner el usuario ne base al ID
    const veterinarioBDD = await Veterinario.findById(id).select("-password")
        // Validar si existe el usuario
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
        // Mostrar lo sadatos al usuario
    res.status(200).json({msg:veterinarioBDD})
}
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findById(id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    if (veterinarioBDD.email !=  req.body.email)
    {
        const veterinarioBDDMail = await Veterinario.findOne({email:req.body.email})
        if (veterinarioBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
		veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBDD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBDD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBDD.email = req.body.email || veterinarioBDD?.email
    await veterinarioBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

const actualizarPassword = async (req,res)=>{
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

const recuperarPassword = async(req,res)=>{
        // Capturamos el email request
    const {email} = req.body
        // Validadción de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        // Obtener el usuario en base al imail
    const veterinarioBDD = await Veterinario.findOne({email})
        // Validación de existencia de usuario
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
        // creación del token
    const token = veterinarioBDD.crearToken()
        // Establecer el token en el usuario optenido previamente
    veterinarioBDD.token=token
        // Enviar el email de recuperación
    await sendMailToRecoveryPassword(email,token)
        // Guardar los cambio en bBDD
    await veterinarioBDD.save()
        // Presentar mensajes al usuario
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

const comprobarTokenPasword = async (req,res)=>{
        // Validar el token
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        // Obtener el usuario en base al token
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
        // Validación si existe el usuario
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        // Guardar en BDD
    await veterinarioBDD.save()
        // Pressentar mensaje al usuario
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

const nuevoPassword = async (req,res)=>{
        // Obtener el password nuevo y la confirmación del password del request
    const{password,confirmpassword} = req.body
        // Validación de campos vacíos
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
        // Validar coinsidencia de los password
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
        // Obtener lo datos del usuario en base al token
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
        // Validar la existencia de usuario
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        // Setear el token nuevamente a null
    veterinarioBDD.token = null
        // encriptar el nuevo password
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
        // Guardar en base de datos
    await veterinarioBDD.save()
        // MOstrar mensaje al usuario
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

// Exportación nombrada: exporta varios
    // Una exportación por default: exporta un sola
export {
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
	nuevoPassword
}