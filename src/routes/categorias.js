const express = require('express');
const { createCategoriasController } = require('../controllers/categorias');
const { createCategoriasModel } = require('../models/categorias');

function createCategoriasRouter(database) {
  const router = express.Router();
  const controller = createCategoriasController(createCategoriasModel(database));

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.getById);
  router.put('/:id', controller.update(true));
  router.patch('/:id', controller.update(false));
  router.delete('/:id', controller.delete);

  return router;
}

module.exports = { createCategoriasRouter };
