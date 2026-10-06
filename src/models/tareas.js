function toTask(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    prioridad: row.prioridad,
    categoriaId: row.categoria_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createTareasModel(database) {
  return {
    list(filters, { limit, offset }) {
      const conditions = [];
      const values = [];

      if (filters.titulo !== undefined) {
        conditions.push('LOWER(titulo) LIKE LOWER(?)');
        values.push(`%${filters.titulo}%`);
      }
      if (filters.prioridad !== undefined) {
        conditions.push('prioridad = ?');
        values.push(filters.prioridad);
      }
      if (filters.categoriaId !== undefined) {
        conditions.push('categoria_id = ?');
        values.push(filters.categoriaId);
      }

      const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
      const total = database.prepare(
        `SELECT COUNT(*) AS total FROM tareas${where}`
      ).get(...values).total;
      const rows = database.prepare(
        `SELECT * FROM tareas${where} ORDER BY id LIMIT ? OFFSET ?`
      ).all(...values, limit, offset);

      return { data: rows.map(toTask), total };
    },
    create({ titulo, prioridad, categoriaId }) {
      const result = database.prepare(
        'INSERT INTO tareas (titulo, prioridad, categoria_id) VALUES (?, ?, ?)'
      ).run(titulo, prioridad, categoriaId);
      return this.findById(Number(result.lastInsertRowid));
    },
    findById(id) {
      const row = database.prepare('SELECT * FROM tareas WHERE id = ?').get(id);
      return row ? toTask(row) : null;
    },
    categoryExists(id) {
      return Boolean(database.prepare('SELECT id FROM categorias WHERE id = ?').get(id));
    },
    update(id, { titulo, prioridad, categoriaId }) {
      database.prepare(`
        UPDATE tareas
        SET titulo = ?, prioridad = ?, categoria_id = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?
      `).run(titulo, prioridad, categoriaId, id);
      return this.findById(id);
    },
    delete(id) {
      return database.prepare('DELETE FROM tareas WHERE id = ?').run(id).changes > 0;
    }
  };
}

module.exports = { createTareasModel };
