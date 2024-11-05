import jwt from "jsonwebtoken";

export const isAdmin = async (req, res, next) => {
    try {
        const header = req.header("Authorization") || "";
        const token = header.split(" ")[1];

        if (!process.env.AUTH_SECRET) {
            throw new Error("AUTH_SECRET no está configurada");
        }

        jwt.verify(token, process.env.AUTH_SECRET, (err, decode) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ mensaje: "Token inválido" });
            }

            if (decode.user.tipo_usuario.trim().toLowerCase() === "administrador") {
                next();
            } else {
                res.status(403).json({ mensaje: "No tienes permiso para esta acción" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

export const adminOrDomiciliario = async (req, res, next) => {
    try {
        const header = req.header("Authorization") || "";
        const token = header.split(" ")[1];

        if (!process.env.AUTH_SECRET) {
            throw new Error("AUTH_SECRET no está configurada");
        }

        jwt.verify(token, process.env.AUTH_SECRET, (err, decode) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ mensaje: "Token inválido" });
            }

            const tipoUsuario = decode.user.tipo_usuario.trim().toLowerCase();

            if (tipoUsuario === "administrador" || tipoUsuario === "domiciliario") {
                next();
            } else {
                res.status(403).json({ mensaje: "No tienes permiso para esta acción" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};