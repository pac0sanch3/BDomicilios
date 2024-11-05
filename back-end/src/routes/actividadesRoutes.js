import { Router } from "express";
import { 
  registrarActividad, 
  listarActividades, 
  obtenerActividad,
  actualizarActividad, 
  eliminarActividad 
} from "../controllers/actividadesController.js";
import { verificar } from "../middleware/LoginMidleware.js";

const RutaActividad = Router();

// Rutas protegidas con verificación de token
RutaActividad.post("/",  registrarActividad);
RutaActividad.get("/",  listarActividades);
RutaActividad.get("/:id",  obtenerActividad);
RutaActividad.put("/:id",  actualizarActividad);
RutaActividad.delete("/:id",  eliminarActividad);

export default RutaActividad;