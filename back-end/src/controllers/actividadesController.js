import { conexion } from "../databases/conexion.js";

// Registrar una actividad
export const registrarActividad = async (req, res) => {
  try {
    const { id_usuario, descripcion, fecha_hora } = req.body;
    const sql = `INSERT INTO registro_actividades (id_usuario, descripcion, fecha_hora, fecha_creacion)
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
    
    const [results] = await conexion.query(sql, [id_usuario, descripcion, fecha_hora]);
    res.status(201).json({ 
      message: 'Actividad registrada exitosamente', 
      id: results.insertId 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al registrar la actividad', 
      details: err 
    });
  }
};

// Listar todas las actividades
export const listarActividades = async (req, res) => {
  try {
    const sql = `SELECT 
                  a.*,
                  u.nombre as nombre_usuario 
                FROM registro_actividades a
                LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
                ORDER BY a.fecha_hora DESC`;
    const [results] = await conexion.query(sql);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al listar actividades', 
      details: err 
    });
  }
};

// Obtener una actividad específica
export const obtenerActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT 
                  a.*,
                  u.nombre as nombre_usuario 
                FROM registro_actividades a
                LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
                WHERE a.id_registro = ?`;
    
    const [results] = await conexion.query(sql, [id]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }
    
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al obtener la actividad', 
      details: err 
    });
  }
};

// Actualizar una actividad
export const actualizarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, descripcion, fecha_hora } = req.body;

    const sql = `UPDATE registro_actividades 
                 SET id_usuario = ?, 
                     descripcion = ?, 
                     fecha_hora = ?
                 WHERE id_registro = ?`;

    const [results] = await conexion.query(sql, [
      id_usuario, 
      descripcion, 
      fecha_hora, 
      id
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }
    
    res.status(200).json({ message: 'Actividad actualizada exitosamente' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al actualizar la actividad', 
      details: err 
    });
  }
};

// Eliminar una actividad
export const eliminarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `DELETE FROM registro_actividades WHERE id_registro = ?`;

    const [results] = await conexion.query(sql, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }
    
    res.status(200).json({ message: 'Actividad eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Error al eliminar la actividad', 
      details: err 
    });
  }
};