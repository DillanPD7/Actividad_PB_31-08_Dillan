const { HttpError, parseId, requireObjectBody } = require('../errors');
const { collectionResponse, parsePagination } = require('../pagination');

function createCategoriasController(model) {
  return {
    list(req, res) {
      const { page, limit, offset } = parsePagination(req.query);
      const filters = {};
      if (req.query.nombre !== undefined) {
        filters.nombre = String(req.query.nombre);
      }

      const result = model.list(filters, { limit, offset });
      res.json(collectionResponse(result.data, page, limit, result.total));
    },
    create(req, res) {
      requireObjectBody(req.body);
      const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
      if (!nombre) {
        throw new HttpError(422, 'El nombre es obligatorio.');
      }
      const descripcion = req.body.descripcion === undefined ? '' : req.body.descripcion;
      if (typeof descripcion !== 'string') {
        throw new HttpError(422, 'La descripción debe ser texto.');
      }

      res.status(201).json(model.create({ nombre, descripcion: descripcion.trim() }));
    },
    getById(req, res) {
      const category = model.findById(parseId(req.params.id));
      if (!category) {
        throw new HttpError(404, 'No se encontró la categoría solicitada.');
      }
      res.json(category);
    },
    update(replace) {
      return (req, res) => {
        const id = parseId(req.params.id);
        requireObjectBody(req.body);
        const current = model.findById(id);
        if (!current) {
          throw new HttpError(404, 'No se encontró la categoría solicitada.');
        }
        if (replace && req.body.nombre === undefined) {
          throw new HttpError(422, 'Para reemplazar una categoría se requiere el nombre.');
        }

        const nombre = req.body.nombre === undefined
          ? current.nombre
          : typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
        const descripcion = req.body.descripcion === undefined
          ? replace ? '' : current.descripcion
          : req.body.descripcion;
        if (!nombre) {
          throw new HttpError(422, 'El nombre es obligatorio.');
        }
        if (typeof descripcion !== 'string') {
          throw new HttpError(422, 'La descripción debe ser texto.');
        }

        res.json(model.update(id, { nombre, descripcion: descripcion.trim() }));
      };
    },
    delete(req, res) {
      const id = parseId(req.params.id);
      if (!model.delete(id)) {
        throw new HttpError(404, 'No se encontró la categoría solicitada.');
      }
      res.status(204).end();
    }
  };
}

module.exports = { createCategoriasController };
