const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { After, Before, Given, Then, When } = require('@cucumber/cucumber');
const request = require('supertest');
const { createApp } = require('../../src/app');
const { initializeDatabase } = require('../../src/database');

Given('que la API está iniciada con datos mock', function () {
  this.database = new DatabaseSync(':memory:');
  initializeDatabase(this.database);

  const insertCategory = this.database.prepare(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)'
  );
  insertCategory.run('Personal', 'Tareas personales');
  insertCategory.run('Trabajo', 'Tareas laborales');

  const insertTask = this.database.prepare(
    'INSERT INTO tareas (titulo, prioridad, categoria_id) VALUES (?, ?, ?)'
  );
  insertTask.run('Estudiar API', 'alta', 1);
  insertTask.run('Comprar alimentos', 'baja', 1);

  this.client = request(createApp(this.database));
});

After(function () {
  this.database.close();
});

When(
  'envío una petición {word} a {string}',
  async function (method, path) {
    this.response = await this.client[method.toLowerCase()](path);
  }
);

When(
  'envío una petición {word} a {string} con el cuerpo:',
  async function (method, path, body) {
    this.response = await this.client[method.toLowerCase()](path)
      .set('Content-Type', 'application/json')
      .send(JSON.parse(body));
  }
);

Then('la respuesta tiene estado {int}', function (status) {
  assert.equal(this.response.status, status);
});

Then('la colección contiene {int} elementos', function (count) {
  assert.equal(this.response.body.data.length, count);
});

Then(
  'la respuesta incluye una tarea con título {string}',
  function (title) {
    assert.ok(
      this.response.body.data.some((task) => task.titulo === title),
      `No se encontró la tarea "${title}"`
    );
  }
);

Then(
  'el recurso devuelto tiene el campo {string} igual a {string}',
  function (field, value) {
    assert.equal(this.response.body[field], value);
  }
);

Then(
  'la respuesta incluye metadatos de paginación para la página {int}',
  function (page) {
    assert.equal(this.response.body.meta.page, page);
    assert.equal(this.response.body.meta.total, 2);
    assert.equal(this.response.body.meta.totalPages, 1);
  }
);
