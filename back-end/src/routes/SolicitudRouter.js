import { Router } from "express"

import {buscarDomi,listSolicitudesCliente, registrarSolicitud, actualizarSolicitud, actEstadoSolicitud, listarSolicitudes, reasignarSoli, listSolicitudesDomi} from '../controllers/SolicitudController.js'



const RutaSolicitud = Router()

RutaSolicitud.post('/registrar',registrarSolicitud )
RutaSolicitud.put('/actualizar',actualizarSolicitud )
RutaSolicitud.put('/actualizarEstado', actEstadoSolicitud)
RutaSolicitud.get('/listar', listarSolicitudes)

RutaSolicitud.put('/reasignarSoli', reasignarSoli)



/* listar las solicitudes de un domiciliario */
RutaSolicitud.get('/listSolicitudesDom/:idDomiciliario', listSolicitudesDomi)
RutaSolicitud.get('/listarSoliClientes/:idCliente', listSolicitudesCliente)

RutaSolicitud.get('/buscarDomic/:idUser', buscarDomi)



export default RutaSolicitud