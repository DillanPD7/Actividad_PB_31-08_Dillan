const { HttpError } = require('./errors');

function parsePagination(query) {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? 10 : Number(query.limit);

  if (!Number.isSafeInteger(page) || page < 1) {
    throw new HttpError(400, 'page debe ser un entero mayor que cero.');
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, 'limit debe ser un entero entre 1 y 100.');
  }

  return { page, limit, offset: (page - 1) * limit };
}

function collectionResponse(data, page, limit, total) {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

module.exports = { parsePagination, collectionResponse };
