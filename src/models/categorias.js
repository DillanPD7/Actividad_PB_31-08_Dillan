function toCategory(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createCategoriasModel(database) {
  return {
    list(filters, { limit, offset }) {
      const conditions = [];
      const values = [];
      if (filters.nombre !== undefined) {
        conditions.push('LOWER(nombre) LIKE LOWER(?)');
        values.push(`%${filters.nombre}%`);
      }

      const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
      const total = database.prepare(
        `SELECT COUNT(*) AS total FROM categorias${where}`
      ).get(...values).total;
      const rows = database.prepare(
        `SELECT * FROM categorias${where} ORDER BY id LIMIT ? OFFSET ?`
      ).all(...values, limit, offset);

      return { data: rows.map(toCategory), total };
    },
    create({ nombre, descripcion }) {
      const result = database.prepare(
        'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)'
      ).run(nombre, descripcion);
      return this.findById(Number(result.lastInsertRowid));
    },
    findById(id) {
      const row = database.prepare('SELECT * FROM categorias WHERE id = ?').get(id);
      return row ? toCategory(row) : null;
    },
    update(id, { nombre, descripcion }) {
      database.prepare(`
        UPDATE categorias
        SET nombre = ?, descripcion = ?,
            updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE id = ?
      `).run(nombre, descripcion, id);
      return this.findById(id);
    },
    delete(id) {
      return database.prepare('DELETE FROM categorias WHERE id = ?').run(id).changes > 0;
    }
  };
}

module.exports = { createCategoriasModel };
