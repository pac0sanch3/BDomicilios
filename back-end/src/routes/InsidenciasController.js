import { Router } from "express";
import {
    listarReportes,
    registrarReporte,
    editarReporte,
    eliminarReporte,
} from "../controllers/InsidenciasController.js";


const RutaInsidencias = Router();

RutaInsidencias.get("/listar", listarReportes);
RutaInsidencias.post("/registrar", registrarReporte);
RutaInsidencias.put("/editar/:id_reporte", editarReporte);
RutaInsidencias.delete("/eliminar/:id_reporte", eliminarReporte);



export default RutaInsidencias;
