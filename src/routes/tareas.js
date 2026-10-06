const express = require('express');
const { createTareasController } = require('../controllers/tareas');
const { createTareasModel } = require('../models/tareas');

function createTareasRouter(database) {
  const router = express.Router();
  const controller = createTareasController(createTareasModel(database));

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.getById);
  router.put('/:id', controller.update(true));
  router.patch('/:id', controller.update(false));
  router.delete('/:id', controller.delete);

  return router;
}

module.exports = { createTareasRouter };
