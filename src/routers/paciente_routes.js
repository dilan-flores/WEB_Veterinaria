import {Router} from 'express'
import {
    actualizarPaciente,
    detallePaciente,
    eliminarPaciente,
    listarPacientes,
    registrarPaciente,
} from "../controllers/paciente_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      paciente:
 *          type: object
 *          properties:
 *              name:
 *                  type: String
 *                  description: El nombre de paciente
 *              propietario:
 *                  type: String
 *                  description: Dueño de mascota
 *              email:
 *                  type: String
 *                  description: Correo del dueño
 *              celular:
 *                  type: String
 *                  description: # celular del dueño
 *              convencional:
 *                  type: String
 *                  description: # convencional del dueño
 *              ingreso:
 *                  type: Date
 *                  description: Fecha de ingreso
 *              sintomas:
 *                  type: String
 *                  description: diagnóstico o requerimientos del paciente
 *              salida:
 *                  type: Date
 *                  description: Fecha y hora de salida
 *              estado:
 *                  type: Boolean
 *                  description: activos
 *              veterinadio:
 *                  type: mongoose.Schema.Types.ObjectId
 *                  description: Id del veterinario
 * 
 *          required:
 *              - name
 *              - propietario
 *              - email
 *              - celular
 *              - convencional
 *              - ingreso
 *              - sintomas
 *              - veterinario 
 *              
 *          example:
 *              name: Goofy
 *              propietario: Alex
 *              email: alex12@gmail.com
 *              celular: 0987456321
 *              convencional: 022158411
 *              ingreso: 04/07/2022
 *              sintomas: corte de pelo
 *              veterinario: 64aa265160a6fbd705b39waq           
 */         


/**
 * @swagger
 * /api/pacientes:
 *  get:
 *      summary: Lista de pacientes de un veterinario
 *      tags: [paciente]
 *      responses:
 *          200:
 *              description: listado de pacientes de un veterinario
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              token:
 *                                  type: String
 *                                  description: Autenticación del veterinario
 *                          example:
 *                              token: eyJhbGciOiJIUzI1DiIsInR5cCI6IkpXDSJ9.eyJpZCI6IjY0YWExNjUxNjBhNmZiZDcwNWIzOWRiZiIsImlhdCI6MTY4ODg2ODczNSwiZXhwIjoxNjg4OTU1MTM1fQ.a29HR8kWqHZXJCz6QQ6LDeZCAQW-2vM-Be7E9P7jtta                   
 */
router.get("/pacientes",verificarAutenticacion,listarPacientes);

/**
 * @swagger
 * /api/paciente/{id}:
 *  get:
 *      summary: Muestra lo datos del paciente
 *      tags: [paciente]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type:string
 *              required:true
 *            description: el id del paciente
 *      responses:
 *          200:
 *              description: datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: Object
 *                          $ref: '#components/schemas/paciente'
 *          404:
 *              description: paciente no encontrado
 */
router.get("/paciente/:id",verificarAutenticacion, detallePaciente);
/**
 * @swagger
 * /api/paciente/registro:
 *  post:
 *      summary: Registro de paciente
 *      tags: [paciente]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: Object
 *                      $ref: '#/components/schemas/paciente'
 *      responses:
 *          200:
 *              description: nuevo paciente registrado    
 */

router.post("/paciente/registro", verificarAutenticacion,registrarPaciente);
/**
 * @swagger
 * /api/paciente/actualizar/{id}:
 *  put:
 *      summary: Actualizar paciente
 *      tags: [paciente]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type:string
 *              required:true
 *            description: el id del paciente
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: Object
 *                      $ref: '#/components/schemas/paciente'
 *      responses:
 *          200:
 *              description: paciente actualizado
 *          404:
 *              description: paciente no encontrado
 */
router.put("/paciente/actualizar/:id", verificarAutenticacion,actualizarPaciente);

/**
 * @swagger
 * paths:
 *  /paciente/eliminar/{id}:
 *      delete:
 *          summary: Eliminar un paciente
 *          tags: [paciente]
 *          operationId: delete a client
 *          parameters:
 *              -   name: id
 *                  in: path
 *                  required: true
 *                  schema:
 *                      type:integer
 *                  description: el id del paciente
 *          responses:
 *              200:
 *                  description: paciente eliminado
 *              404:
 *                  description: paciente no encontrado
 */

router.delete("/paciente/eliminar/:id", verificarAutenticacion,eliminarPaciente);


export default router
