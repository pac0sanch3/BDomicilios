import { Router } from "express";
import {
  registrarUsuario,
  login,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  listarUsuarios,
  recuperarPassword,
  cambiarContrasena,

    /* graficos */
    obtenerTiempoPromedioEntrega,
    obtenerCantidadPedidos,
    obtenerEstadisticasIncidencias,
    obtenerRendimientoDomiciliarios
} from "../controllers/UserController.js";



// validar token que llega por la cabecera de la solicitud
import { verificar } from "../middleware/LoginMidleware.js";
import { isAdmin } from "../middleware/isAdministrador.js";

const RutaUsuario = Router();

RutaUsuario.post("/registrar", registrarUsuario);
RutaUsuario.post('/login', login);
RutaUsuario.get("/user/:id", obtenerUsuarioPorId);
RutaUsuario.get("/user/", listarUsuarios);
RutaUsuario.put("/actualizar/:id", actualizarUsuario);
RutaUsuario.delete("/eliminar/:id", verificar, isAdmin, eliminarUsuario);

/* recuperar contraseña */
RutaUsuario.post('/recuperar-password', recuperarPassword);
RutaUsuario.post("/cambiar-contrasena", cambiarContrasena);

/* graficos */
RutaUsuario.get("/reportes/tiempo-promedio-entrega", obtenerTiempoPromedioEntrega);
RutaUsuario.get("/reportes/cantidad-pedidos", obtenerCantidadPedidos);
RutaUsuario.get("/reportes/incidencias", obtenerEstadisticasIncidencias);
RutaUsuario.get("/reportes/rendimiento-domiciliarios", obtenerRendimientoDomiciliarios);

export default RutaUsuario;
