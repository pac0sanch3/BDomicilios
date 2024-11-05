import { conexion } from "../databases/conexion.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Función auxiliar para validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateEmail = (email) => emailRegex.test(email);

// Función auxiliar para validar teléfono
const phoneRegex = /^\d{10}$/;
const validatePhone = (phone) => phoneRegex.test(phone);

// Registro de usuarios
export const registrarUsuario = async (req, res) => {
    try { 
        const { nombre, tipo_usuario, correo, telefono, contrasena } = req.body;

        // Validaciones básicas
        if (!nombre || !tipo_usuario || !correo || !telefono || !contrasena) {
            return res.status(400).json({ 
                mensaje: "Todos los campos son obligatorios" 
            });
        }

        // Validar formato de email
        if (!validateEmail(correo)) {
            return res.status(400).json({ 
                mensaje: "Formato de correo electrónico inválido" 
            });
        }

        // Validar formato de teléfono
        if (!validatePhone(telefono)) {
            return res.status(400).json({ 
                mensaje: "El teléfono debe tener 10 dígitos" 
            });
        }

        // Validar tipo de usuario
        const tiposValidos = ['administrador', 'negocio', 'particular', 'domiciliario'];
        if (!tiposValidos.includes(tipo_usuario)) {
            return res.status(400).json({ 
                mensaje: "Tipo de usuario inválido" 
            });
        }

        // Verificar si el correo ya existe
        const [existeCorreo] = await conexion.query(
            "SELECT correo FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (existeCorreo.length > 0) {
            return res.status(400).json({ 
                mensaje: "El correo ya está registrado" 
            });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(contrasena, salt);

        // Insertar usuario
        const [resultado] = await conexion.query(
            `INSERT INTO usuarios (nombre, tipo_usuario, correo, telefono, contrasena, estado) 
             VALUES (?, ?, ?, ?, ?, 'activo')`,
            [nombre, tipo_usuario, correo, telefono, hashPassword]
        );

        return res.status(201).json({
            mensaje: "Usuario registrado exitosamente",
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al registrar usuario",
            error: error.message
        });
    }
};

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
    try {
        const [usuarios] = await conexion.query(
            "SELECT id_usuario, nombre, tipo_usuario, correo, telefono, estado, fecha_creacion, fecha_actualizacion FROM usuarios"
        );

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al listar usuarios",
            error: error.message
        });
    }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const [usuario] = await conexion.query(
            `SELECT id_usuario, nombre, tipo_usuario, correo, telefono, estado, 
             fecha_creacion, fecha_actualizacion 
             FROM usuarios WHERE id_usuario = ?`,
            [id]
        );

        if (usuario.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json(usuario[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener usuario",
            error: error.message
        });
    }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo_usuario, correo, telefono, estado } = req.body;

        // Verificar si el usuario existe
        const [usuarioExiste] = await conexion.query(
            "SELECT * FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        if (usuarioExiste.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        // Validaciones básicas
        if (correo && !validateEmail(correo)) {
            return res.status(400).json({
                mensaje: "Formato de correo electrónico inválido"
            });
        }

        if (telefono && !validatePhone(telefono)) {
            return res.status(400).json({
                mensaje: "El teléfono debe tener 10 dígitos"
            });
        }

        if (tipo_usuario) {
            const tiposValidos = ['administrador', 'negocio', 'particular', 'domiciliario'];
            if (!tiposValidos.includes(tipo_usuario)) {
                return res.status(400).json({
                    mensaje: "Tipo de usuario inválido"
                });
            }
        }

        if (estado && !['activo', 'inactivo'].includes(estado)) {
            return res.status(400).json({
                mensaje: "Estado inválido"
            });
        }

        // Verificar si el nuevo correo ya existe
        if (correo && correo !== usuarioExiste[0].correo) {
            const [existeCorreo] = await conexion.query(
                "SELECT correo FROM usuarios WHERE correo = ? AND id_usuario != ?",
                [correo, id]
            );

            if (existeCorreo.length > 0) {
                return res.status(400).json({
                    mensaje: "El correo ya está registrado"
                });
            }
        }

        // Actualizar usuario
        const [resultado] = await conexion.query(
            `UPDATE usuarios 
             SET nombre = COALESCE(?, nombre),
                 tipo_usuario = COALESCE(?, tipo_usuario),
                 correo = COALESCE(?, correo),
                 telefono = COALESCE(?, telefono),
                 estado = COALESCE(?, estado),
                 fecha_actualizacion = CURRENT_TIMESTAMP
             WHERE id_usuario = ?`,
            [nombre, tipo_usuario, correo, telefono, estado, id]
        );

        return res.status(200).json({
            mensaje: "Usuario actualizado exitosamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al actualizar usuario",
            error: error.message
        });
    }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el usuario existe
        const [usuarioExiste] = await conexion.query(
            "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        if (usuarioExiste.length === 0) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        // Eliminar usuario
        await conexion.query(
            "DELETE FROM usuarios WHERE id_usuario = ?",
            [id]
        );

        return res.status(200).json({
            mensaje: "Usuario eliminado exitosamente"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al eliminar usuario",
            error: error.message
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        // Buscar usuario
        const [usuarios] = await conexion.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        const usuario = usuarios[0];

        // Verificar estado
        if (usuario.estado !== 'activo') {
            return res.status(401).json({
                mensaje: "Usuario inactivo"
            });
        }

        // Verificar contraseña
        const contrasenasCoinciden = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!contrasenasCoinciden) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas"
            });
        }

        if (!process.env.AUTH_SECRET) {
            throw new Error("AUTH_SECRET no está configurada");
        }

        // Generar token
        const token = jwt.sign(
            {
                user: {
                    id: usuario.id_usuario,
                    tipo_usuario: usuario.tipo_usuario
                }
            },
            process.env.AUTH_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                tipo_usuario: usuario.tipo_usuario,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error en el login",
            error: error.message
        });
    }
};

/* graficas */
export const obtenerTiempoPromedioEntrega = async (req, res) => {
    try {
        const [result] = await conexion.query(`
            SELECT IFNULL(AVG(TIMESTAMPDIFF(MINUTE, fecha_creacion, fecha_actualizacion)), 0) AS promedio_entrega
            FROM solicitudes
            WHERE estado = 'completado'
        `);
        return res.status(200).json({ promedio_entrega: result[0].promedio_entrega });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener el tiempo promedio de entrega",
            error: error.message
        });
    }
};


export const obtenerCantidadPedidos = async (req, res) => {
    try {
        const [result] = await conexion.query(`
            SELECT COUNT(*) AS total_pedidos
            FROM solicitudes
        `);
        return res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener la cantidad de pedidos",
            error: error.message
        });
    }
};


export const obtenerEstadisticasIncidencias = async (req, res) => {
    try {
        const [result] = await conexion.query(`
            SELECT tipo_incidencia, COUNT(*) AS total_incidencias, 
                   AVG(TIMESTAMPDIFF(HOUR, fecha_reporte, fecha_actualizacion)) AS promedio_resolucion_horas
            FROM reporte_incidencias
            GROUP BY tipo_incidencia
        `);
        

        
        if (result.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron estadísticas de incidencias",
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener estadísticas de incidencias",
            error: error.message
        });
    }
};


export const obtenerRendimientoDomiciliarios = async (req, res) => {
    try {
        const [result] = await conexion.query(`
            SELECT d.id_domiciliario, u.nombre, 
                   IFNULL(COUNT(s.id_solicitud), 0) AS total_entregas,
                   IFNULL(AVG(TIMESTAMPDIFF(MINUTE, s.fecha_creacion, s.fecha_actualizacion)), 0) AS promedio_entrega
            FROM domiciliarios d
            INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN solicitudes s ON s.id_domiciliario = d.id_domiciliario
            WHERE s.estado = 'completado'
            GROUP BY d.id_domiciliario, u.nombre
        `);
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener rendimiento de domiciliarios",
            error: error.message
        });
    }
};



// Recuperar contraseña
import crypto from 'crypto';

// Función para generar una contraseña temporal aleatoria
const generarContrasenaTemporal = () => {
    // Genera una contraseña de 8 caracteres
    return crypto.randomBytes(4).toString('hex');
};

// Controlador para recuperar contraseña
export const recuperarPassword = async (req, res) => {
    try {
        const { correo } = req.body;

        // Validar que se proporcionó un correo
        if (!correo) {
            return res.status(400).json({
                mensaje: "El correo es obligatorio"
            });
        }

        // Validar formato de email
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };

        if (!validateEmail(correo)) {
            return res.status(400).json({
                mensaje: "Formato de correo electrónico inválido"
            });
        }

        // Buscar usuario por correo
        const [usuarios] = await conexion.query(
            "SELECT id_usuario, nombre, correo FROM usuarios WHERE correo = ? AND estado = 'activo'",
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: "No existe un usuario activo con este correo electrónico"
            });
        }

        const usuario = usuarios[0];
        
        // Generar nueva contraseña temporal
        const nuevaContrasena = generarContrasenaTemporal();
        
        // Encriptar la nueva contraseña para almacenarla
        const salt = await bcrypt.genSalt(10);
        const hashContrasena = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar la contraseña en la base de datos
        await conexion.query(
            "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?",
            [hashContrasena, usuario.id_usuario]
        );

        return res.status(200).json({
            mensaje: `Usuario ${usuario.nombre}, tu nueva contraseña temporal es: ${nuevaContrasena}`,
            nombre: usuario.nombre,
            contrasenaTemporal: nuevaContrasena
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al procesar la solicitud de recuperación de contraseña",
            error: error.message
        });
    }
};

export const cambiarContrasena = async (req, res) => {
    try {
        const { id_usuario, contrasenaActual, nuevaContrasena } = req.body;

        if (!id_usuario || !contrasenaActual || !nuevaContrasena) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }

        // Verificar usuario y contraseña actual
        const [usuarios] = await conexion.query(
            "SELECT contrasena FROM usuarios WHERE id_usuario = ? AND estado = 'activo'",
            [id_usuario]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const coincideContrasena = await bcrypt.compare(contrasenaActual, usuarios[0].contrasena);
        if (!coincideContrasena) {
            return res.status(400).json({ mensaje: "Contraseña actual incorrecta" });
        }

        // Encriptar y guardar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashNuevaContrasena = await bcrypt.hash(nuevaContrasena, salt);

        await conexion.query(
            "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?",
            [hashNuevaContrasena, id_usuario]
        );

        return res.status(200).json({ mensaje: "Contraseña actualizada exitosamente" });

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        return res.status(500).json({ mensaje: "Error al cambiar la contraseña" });
    }
};

