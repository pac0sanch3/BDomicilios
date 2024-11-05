import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import RutaUsuario from "./src/routes/UserRoutes.js";
import RutaInsidencias from "./src/routes/InsidenciasController.js";
import RutaDomiciliario from "./src/routes/domiciliariosRouter.js";
import RutaNovedad from "./src/routes/novedadesRouter.js";
import RutaSolicitud from "./src/routes/SolicitudRouter.js"
import RutaActividad from './src/routes/actividadesRoutes.js'
import RutaNegocio from './src/routes/negocioRoutes.js'

const servidor = Express()
const port = 3000

servidor.use(cors())
servidor.use(bodyParser.json())
servidor.use(bodyParser.urlencoded({ extended: true }))
servidor.use(Express.static("./public"))

servidor.use("/usuario", RutaUsuario);
servidor.use("/insidencias",RutaInsidencias);
servidor.use("/novedad", RutaNovedad);
servidor.use("/domiciliario", RutaDomiciliario);
servidor.use("/solicitudes", RutaSolicitud);
servidor.use("/actividades", RutaActividad);
servidor.use("/negocio", RutaNegocio);

servidor.get("/", (req, res) => {
    res.status(200).json({ mensaje: "Bienvenidos a RunWay" })
})

servidor.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://192.168.50.200:${port}`)
})
