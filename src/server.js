const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { createApp } = require('./app');
const { initializeDatabase } = require('./database');

const dataDirectory = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(path.join(dataDirectory, 'database.sqlite'));
initializeDatabase(database);

const port = Number(process.env.PORT || 3000);
createApp(database).listen(port, () => {
  console.log(`API disponible en http://localhost:${port}/api/v1`);
});
