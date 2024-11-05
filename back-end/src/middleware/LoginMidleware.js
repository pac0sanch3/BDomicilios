import jwt from "jsonwebtoken";

export const verificar = (req, res, next) => {
    try {
        const header = req.header("Authorization") || "";
        const token = header.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Tu conexión ha expirado. Vuelve a hacer login.",
                estado: 401,
            });
        }

        if (!process.env.AUTH_SECRET) {
            throw new Error("AUTH_SECRET no está configurada");
        }

        const payload = jwt.verify(token, process.env.AUTH_SECRET);
        req.user = payload.user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Token no válido" });
    }
};
