import { Router } from "express";
import { registrarDomiciliario, listarDomiciliarios, actualizarDomiciliario, eliminarDomiciliario, actualizarDisponibilidad } from "../controllers/domiciliariosController.js";
import { verificar } from "../middleware/LoginMidleware.js";

const RutaDomiciliario = Router();

RutaDomiciliario.post("/",  registrarDomiciliario);
RutaDomiciliario.get("/",  listarDomiciliarios);
RutaDomiciliario.put("/:id",  actualizarDomiciliario);
RutaDomiciliario.delete("/:id",  eliminarDomiciliario);
RutaDomiciliario.put("/disponibilidad/:id",  actualizarDisponibilidad);

export default RutaDomiciliario;