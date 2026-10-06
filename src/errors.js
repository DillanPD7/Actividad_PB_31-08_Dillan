class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new HttpError(400, 'El ID debe ser un entero positivo.');
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new HttpError(400, 'El ID está fuera del rango permitido.');
  }
  return id;
}

function requireObjectBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(422, 'El cuerpo debe ser un objeto JSON.');
  }
}

module.exports = { HttpError, parseId, requireObjectBody };
