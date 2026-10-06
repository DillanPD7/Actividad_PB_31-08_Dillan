const { HttpError, parseId, requireObjectBody } = require('../errors');
const { collectionResponse, parsePagination } = require('../pagination');

const PRIORIDADES = new Set(['baja', 'media', 'alta']);

function createTareasController(model) {
  return {
    list(req, res) {
      const { page, limit, offset } = parsePagination(req.query);
      const filters = {};
      if (req.query.titulo !== undefined) {
        filters.titulo = String(req.query.titulo);
      }
      if (req.query.prioridad !== undefined) {
        if (!PRIORIDADES.has(req.query.prioridad)) {
          throw new HttpError(400, 'La prioridad debe ser baja, media o alta.');
        }
        filters.prioridad = req.query.prioridad;
      }
      if (req.query.categoriaId !== undefined) {
        filters.categoriaId = parseId(String(req.query.categoriaId));
      }

      const result = model.list(filters, { limit, offset });
      res.json(collectionResponse(result.data, page, limit, result.total));
    },
    create(req, res) {
      requireObjectBody(req.body);
      const titulo = typeof req.body.titulo === 'string' ? req.body.titulo.trim() : '';
      if (!titulo) {
        throw new HttpError(422, 'El título es obligatorio.');
      }

      const prioridad = req.body.prioridad === undefined ? 'media' : req.body.prioridad;
      if (typeof prioridad !== 'string' || !PRIORIDADES.has(prioridad)) {
        throw new HttpError(422, 'La prioridad debe ser baja, media o alta.');
      }

      let categoriaId = null;
      if (req.body.categoriaId !== undefined && req.body.categoriaId !== null) {
        categoriaId = parseId(String(req.body.categoriaId));
        if (!model.categoryExists(categoriaId)) {
          throw new HttpError(422, 'La categoría indicada no existe.');
        }
      }

      res.status(201).json(model.create({ titulo, prioridad, categoriaId }));
    },
    getById(req, res) {
      const task = model.findById(parseId(req.params.id));
      if (!task) {
        throw new HttpError(404, 'No se encontró la tarea solicitada.');
      }
      res.json(task);
    },
    update(replace) {
      return (req, res) => {
        const id = parseId(req.params.id);
        requireObjectBody(req.body);
        const current = model.findById(id);
        if (!current) {
          throw new HttpError(404, 'No se encontró la tarea solicitada.');
        }
        if (replace && (req.body.titulo === undefined || req.body.prioridad === undefined)) {
          throw new HttpError(422, 'Para reemplazar una tarea se requieren título y prioridad.');
        }

        const titulo = req.body.titulo === undefined
          ? current.titulo
          : typeof req.body.titulo === 'string' ? req.body.titulo.trim() : '';
        const prioridad = req.body.prioridad === undefined
          ? current.prioridad
          : req.body.prioridad;
        let categoriaId = current.categoriaId;

        if (!titulo) {
          throw new HttpError(422, 'El título es obligatorio.');
        }
        if (typeof prioridad !== 'string' || !PRIORIDADES.has(prioridad)) {
          throw new HttpError(422, 'La prioridad debe ser baja, media o alta.');
        }
        if (req.body.categoriaId !== undefined) {
          categoriaId = req.body.categoriaId === null
            ? null
            : parseId(String(req.body.categoriaId));
          if (categoriaId !== null && !model.categoryExists(categoriaId)) {
            throw new HttpError(422, 'La categoría indicada no existe.');
          }
        } else if (replace) {
          categoriaId = null;
        }

        res.json(model.update(id, { titulo, prioridad, categoriaId }));
      };
    },
    delete(req, res) {
      const id = parseId(req.params.id);
      if (!model.delete(id)) {
        throw new HttpError(404, 'No se encontró la tarea solicitada.');
      }
      res.status(204).end();
    }
  };
}

module.exports = { createTareasController };
