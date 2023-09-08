// Importacion de express
const express = require('express');
const cors = require('cors');
const pool = require('../database/db.js');

const { validaPuntos, validaidPuntos } = require('../validaciones/ValidarPuntos.js');
const { auditar } = require('../funciones/funciones.js')

const routerPuntos = express.Router();
routerPuntos.use(express.json());
routerPuntos.use(cors());

routerPuntos.post('/', validaPuntos, async (req, res) => {
  try {
    const { id_poligono, latitud, longitud } = req.body;
    const operacion = req.method;
    const id_usuarioAuditoria = req.headers['id_usuario'];

    const consulta = `
      WITH validaciones AS (
        SELECT
          NOT EXISTS (SELECT 1 FROM puntos WHERE id_poligono = $1 AND latitud = $2 AND longitud = $3) AS puntoNoExiste,
          EXISTS (SELECT 1 FROM poligonos WHERE id_poligono = $1) AS existePoligono
      ),
      insercion AS (
        INSERT INTO puntos (id_poligono, latitud, longitud)
        SELECT $1, $2, $3
        FROM validaciones
        WHERE puntoNoExiste = true AND existePoligono = true
        RETURNING *
      )
      SELECT * FROM insercion;
    `;

    const result = await pool.query(consulta, [id_poligono, latitud, longitud]);

    if (result.rows.length === 0) {
      return res.status(400).send({ error: 'No se pudo crear el punto debido a las validaciones' });
    }

    auditar(operacion, id_usuarioAuditoria);

    res.status(200).json({ mensaje: 'Punto creado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al crear el punto' });
  }
});
//update
routerPuntos.put('/:id_punto', validaPuntos, async (req, res) => {
  try {
    const { id_punto } = req.params;
    const { id_poligono, latitud, longitud } = req.body;
    const operacion = req.method;
    const id_usuarioAuditoria = req.headers['id_usuario'];

    const consulta = `
      WITH validaciones AS (
        SELECT
          p.id_punto,
          EXISTS (SELECT 1 FROM poligonos WHERE id_poligono = $1) AS existePoligono
        FROM puntos p
        WHERE p.id_punto = $2
      ),
      modificacion AS (
        UPDATE puntos p
        SET id_poligono = $1, latitud = $2, longitud = $3
        FROM validaciones v
        WHERE p.id_punto = v.id_punto AND v.existePoligono
        RETURNING p.*
      )
      SELECT * FROM modificacion;
    `;

    const result = await pool.query(consulta, [id_poligono, id_punto, latitud, longitud]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No se pudo modificar el punto debido a las validaciones' });
    }

    auditar(operacion, id_usuarioAuditoria);

    res.status(200).json({ mensaje: 'Punto modificado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al modificar el punto' });
  }
});


//delete
routerPuntos.delete('/:id_punto', validaidPuntos, async (req, res) => {
  try {
    const { id_punto } = req.params;
    const operacion = req.method;
    const id_usuarioAuditoria = req.headers['id_usuario'];

    const borrarPunto = await pool.query('DELETE FROM "puntos" WHERE id_punto = $1', [id_punto]);

    auditar(operacion, id_usuarioAuditoria);

    if (borrarPunto.rowCount === 0) {
      // No se eliminó ningún polígono, ya que no se encontró en la base de datos
      return res.status(404).json({ error: 'Punto no encontrado' });
    }
    res.json('El punto fue borrado');
  } catch (err) {
    console.error(err.message)
  }
})

//get all puntos and order them from first to last

routerPuntos.get('/', async (req, res) => {
  try {
    const puntos = await pool.query('SELECT * FROM puntos ORDER BY id_punto ASC');
    res.json(puntos.rows);
  } catch (error) {
    console.log(error);
  }
})




module.exports = routerPuntos;