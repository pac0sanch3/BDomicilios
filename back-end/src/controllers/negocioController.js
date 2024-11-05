import { conexion } from "../databases/conexion.js";
import multer from "multer";
import path from "path";

// Configuración de multer para cargar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({ storage });

// Registrar un negocio
export const registrarNegocio = async (req, res) => {
  try {
    const { id_usuario, nombre_negocio, direccion } = req.body;
    const imagen_banner = req.file ? req.file.filename : null; // Obtiene el nombre del archivo subido, si existe

    const sql = `
      INSERT INTO negocios (id_usuario, nombre_negocio, imagen_banner, direccion, fecha_creacion)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    const [results] = await conexion.query(sql, [id_usuario, nombre_negocio, imagen_banner, direccion]);
    res.status(201).json({
      message: "Negocio registrado exitosamente",
      id_negocio: results.insertId
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al registrar el negocio",
      details: err
    });
  }
};

// Listar todos los negocios
export const listarNegocios = async (req, res) => {
  try {
    const sql = `SELECT * FROM negocios ORDER BY fecha_creacion DESC`;
    const [results] = await conexion.query(sql);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: "Error al listar negocios",
      details: err
    });
  }
};

// Obtener un negocio específico
export const obtenerNegocio = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT * FROM negocios WHERE id_negocio = ?`;
    
    const [results] = await conexion.query(sql, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({
      error: "Error al obtener el negocio",
      details: err
    });
  }
};

// Actualizar un negocio
export const actualizarNegocio = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, nombre_negocio, direccion } = req.body;
    const imagen_banner = req.file ? req.file.filename : null; // Obtiene el nombre del archivo subido, si existe

    const sql = `
      UPDATE negocios 
      SET id_usuario = ?, 
          nombre_negocio = ?, 
          imagen_banner = ?, 
          direccion = ?, 
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_negocio = ?
    `;

    const [results] = await conexion.query(sql, [
      id_usuario, 
      nombre_negocio, 
      imagen_banner, 
      direccion, 
      id
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    
    res.status(200).json({ message: "Negocio actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({
      error: "Error al actualizar el negocio",
      details: err
    });
  }
};

// Eliminar un negocio
export const eliminarNegocio = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM negocios WHERE id_negocio = ?`;

    const [results] = await conexion.query(sql, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Negocio no encontrado" });
    }
    
    res.status(200).json({ message: "Negocio eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({
      error: "Error al eliminar el negocio",
      details: err
    });
  }
};

// Exportamos el middleware de multer para ser usado en las rutas
export const uploadMiddleware = upload.single("imagen_banner");
