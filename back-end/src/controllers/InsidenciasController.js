import { conexion } from "../databases/conexion.js";

export const registrarReporte = async (req, res) => {
    const { id_usuario, id_solicitud, tipo_incidencia, descripcion, estado } = req.body;
    const fecha_reporte = new Date();
    const fecha_creacion = new Date();

    console.log('Datos recibidos:', { id_usuario, id_solicitud, tipo_incidencia, descripcion, estado });

    try {
      const query = `
        INSERT INTO reporte_incidencias 
        (id_usuario, id_solicitud, tipo_incidencia, descripcion, estado, fecha_reporte, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await conexion.query(query, [id_usuario, id_solicitud, tipo_incidencia, descripcion, estado, fecha_reporte, fecha_creacion]);
      res.status(201).json({ message: 'Reporte de incidencia registrado correctamente' });
    } catch (error) {
      console.error('Error al registrar el reporte de incidencia:', error);
      res.status(500).json({ message: 'Error al registrar el reporte de incidencia', error: error.message });
    }
    
  };
  

export const listarReportes = async (req, res) => {
    try {
      const query = 'SELECT * FROM reporte_incidencias';
      const [reportes] = await conexion.query(query);
      res.status(200).json({ reportes });
    } catch (error) {
      res.status(500).json({ error: 'Error al listar los reportes de incidencias' });
    }
  };
  export const editarReporte = async (req, res) => {
    const { id_reporte } = req.params;
    const { tipo_incidencia, descripcion, estado } = req.body;
    const fecha_actualizacion = new Date();
  
    try {
        const updates = [];
        const values = [];

        // Construimos la consulta solo con los campos que se proporcionan en req.body
        if (tipo_incidencia) {
            updates.push("tipo_incidencia = ?");
            values.push(tipo_incidencia);
        }
        if (descripcion) {
            updates.push("descripcion = ?");
            values.push(descripcion);
        }
        if (estado) {
            updates.push("estado = ?");
            values.push(estado);
        }
        updates.push("fecha_actualizacion = ?");
        values.push(fecha_actualizacion);
        
        values.push(id_reporte); // Agregamos id_reporte al final para WHERE

        const query = `
            UPDATE reporte_incidencias 
            SET ${updates.join(", ")} 
            WHERE id_reporte = ?
        `;
        await conexion.query(query, values);

        res.status(200).json({ message: 'Reporte de incidencia actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar el reporte:", error);
        res.status(500).json({ error: 'Error al actualizar el reporte de incidencia' });
    }
};


  export const eliminarReporte = async (req, res) => {
    const { id_reporte } = req.params;
  
    try {
      const query = 'DELETE FROM reporte_incidencias WHERE id_reporte = ?';
      await conexion.query(query, [id_reporte]);
      res.status(200).json({ message: 'Reporte de incidencia eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el reporte de incidencia' });
    }
  };
  