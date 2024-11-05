import { conexion } from "../databases/conexion.js";

export const registrarDomiciliario = async (req, res) => {
    try {
      const { id_usuario, licencia_vehiculo, disponibilidad } = req.body;
      
      // Validar que id_usuario sea un número
      if (!id_usuario || isNaN(id_usuario)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
      }

      const sql = `INSERT INTO domiciliarios (id_usuario, licencia_vehiculo, disponibilidad)
                   VALUES (?, ?, ?)`;
  
      const [results] = await conexion.query(sql, [
        id_usuario, 
        licencia_vehiculo, 
        disponibilidad || 'disponible'
      ]);
      
      res.status(201).json({ 
        message: 'Domiciliario registrado exitosamente', 
        id: results.insertId 
      });
    } catch (err) {
      console.error('Error al registrar domiciliario:', err);
      res.status(500).json({ 
        error: 'Error al registrar el domiciliario', 
        details: err.message 
      });
    }
};
  
export const listarDomiciliarios = async (req, res) => {
    try {
      const sql = `SELECT * FROM domiciliarios`;
      const [results] = await conexion.query(sql);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error al listar domiciliarios:', err);
      res.status(500).json({ 
        error: 'Error al listar domiciliarios', 
        details: err.message 
      });
    }
};
  
export const actualizarDomiciliario = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_usuario, licencia_vehiculo, disponibilidad } = req.body;
      
      // Validaciones
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de domiciliario inválido' });
      }
      
      const sql = `UPDATE domiciliarios SET 
                     id_usuario = ?, 
                     licencia_vehiculo = ?, 
                     disponibilidad = ?, 
                     fecha_actualizacion = CURRENT_TIMESTAMP
                   WHERE id_domiciliario = ?`;
  
      const [results] = await conexion.query(sql, [
        id_usuario, 
        licencia_vehiculo, 
        disponibilidad, 
        id
      ]);
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Domiciliario no encontrado' });
      }
      
      res.status(200).json({ message: 'Domiciliario actualizado exitosamente' });
    } catch (err) {
      console.error('Error al actualizar domiciliario:', err);
      res.status(500).json({ 
        error: 'Error al actualizar el domiciliario', 
        details: err.message 
      });
    }
};
  
export const eliminarDomiciliario = async (req, res) => {
    try {
      const { id } = req.params;

      // Validar ID
      if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID de domiciliario inválido' });
      }

      const sql = `DELETE FROM domiciliarios WHERE id_domiciliario = ?`;
  
      const [results] = await conexion.query(sql, [id]);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Domiciliario no encontrado' });
      }
      
      res.status(200).json({ message: 'Domiciliario eliminado exitosamente' });
    } catch (err) {
      console.error('Error al eliminar domiciliario:', err);
      res.status(500).json({ 
        error: 'Error al eliminar el domiciliario', 
        details: err.message 
      });
    }
};

export const actualizarDisponibilidad = async (req, res) => {
  try {
      const { id } = req.params;

      // Validación del ID
      if (!id || isNaN(id)) {
          return res.status(400).json({ error: 'ID de domiciliario inválido' });
      }

      // Consulta para obtener el valor actual de disponibilidad
      const [domiciliario] = await conexion.query(
          `SELECT disponibilidad FROM domiciliarios WHERE id_domiciliario = ?`,
          [id]
      );

      // Verificar si el domiciliario existe
      if (!domiciliario || domiciliario.length === 0) {
          return res.status(404).json({ message: 'Domiciliario no encontrado' });
      }

      // Obtener el valor actual y definir el siguiente estado
      const opcionesDisponibilidad = ['disponible', 'no_disponible', 'inactivo'];
      const currentDisponibilidad = domiciliario[0].disponibilidad;
      const nextIndex = (opcionesDisponibilidad.indexOf(currentDisponibilidad) + 1) % opcionesDisponibilidad.length;
      const nextDisponibilidad = opcionesDisponibilidad[nextIndex];

      // Consulta SQL para actualizar la disponibilidad al siguiente estado
      const sql = `UPDATE domiciliarios SET 
                      disponibilidad = ?, 
                      fecha_actualizacion = CURRENT_TIMESTAMP
                   WHERE id_domiciliario = ?`;

      const [results] = await conexion.query(sql, [
          nextDisponibilidad, 
          id
      ]);

      // Verificación de resultados
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Domiciliario no encontrado' });
      }

      res.status(200).json({ 
          message: 'Disponibilidad del domiciliario actualizada exitosamente', 
          nuevaDisponibilidad: nextDisponibilidad 
      });
  } catch (err) {
      console.error('Error al actualizar disponibilidad:', err);
      res.status(500).json({ 
          error: 'Error al actualizar la disponibilidad del domiciliario', 
          details: err.message 
      });
  }
};

