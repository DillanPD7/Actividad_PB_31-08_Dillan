const express = require('express');
const { HttpError } = require('./errors');
const { createCategoriasRouter } = require('./routes/categorias');
const { createTareasRouter } = require('./routes/tareas');

function createApp(database) {
  const app = express();

  app.use(express.json());
  app.use('/api/v1/tareas', createTareasRouter(database));
  app.use('/api/v1/categorias', createCategoriasRouter(database));

  app.use((req, res) => {
    res.status(404).json({ error: { message: 'Ruta no encontrada.' } });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error instanceof HttpError) {
      return res.status(error.status).json({ error: { message: error.message } });
    }
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return res.status(400).json({ error: { message: 'El cuerpo JSON no es válido.' } });
    }
    if (error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: { message: 'Ya existe un recurso con esos datos.' } });
    }

    console.error(error);
    return res.status(500).json({ error: { message: 'Error interno del servidor.' } });
  });

  return app;
}

module.exports = { createApp };
