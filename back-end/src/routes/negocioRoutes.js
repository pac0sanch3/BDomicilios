import express from "express";
import { 
  registrarNegocio, 
  listarNegocios, 
  obtenerNegocio, 
  actualizarNegocio, 
  eliminarNegocio, 
  uploadMiddleware 
} from "../controllers/negocioController.js"; 

const RutaNegocio = express.Router();

// Ruta para registrar un negocio
RutaNegocio.post("/registrar-negocio", uploadMiddleware, registrarNegocio);

// Ruta para listar todos los negocios
RutaNegocio.get("/listar", listarNegocios);

// Ruta para obtener un negocio específico
RutaNegocio.get("/listar/:id", obtenerNegocio);

// Ruta para actualizar un negocio
RutaNegocio.put("/actualizar/:id", uploadMiddleware, actualizarNegocio);

// Ruta para eliminar un negocio
RutaNegocio.delete("/eliminar/:id", eliminarNegocio);

export default RutaNegocio; 
