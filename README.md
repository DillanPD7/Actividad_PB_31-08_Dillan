# API de tareas y categorías

API REST versionada construida con Express y SQLite. Incluye CRUD de tareas y
categorías, filtros, paginación y pruebas de aceptación Gherkin ejecutadas con
Cucumber y Supertest.

## Requisitos y ejecución

- Node.js 22.5 o posterior (usa el módulo integrado `node:sqlite`).

```powershell
npm install
npm test
npm start
```

La API escucha en `http://localhost:3000` por defecto. Se puede cambiar el
puerto con la variable de entorno `PORT`. La base persistente se crea en
`data/database.sqlite`.

## Estructura

```text
data/
  database.sqlite        Base SQLite persistente (se genera al iniciar)
features/
  tareas.feature         Escenarios Gherkin para tareas
  categorias.feature     Escenarios Gherkin para categorías
src/
  app.js                 Configuración de Express y manejo HTTP de errores
  controllers/           Validación HTTP y coordinación de casos de uso
  models/                Consultas y persistencia SQLite
  routes/                Rutas HTTP de cada entidad
  database.js            Esquema e inicialización de SQLite
  errors.js              Errores HTTP y validación de IDs
  pagination.js          Validación y metadatos de colecciones
  server.js              Inicio de la API y conexión persistente
test/
  steps/                 Pasos Cucumber con Supertest y SQLite en memoria
cucumber.js              Configuración de descubrimiento de features y pasos
```

Los escenarios en `features/` crean una base SQLite en memoria por caso y cargan
categorías y tareas mock; no dependen de los datos persistentes de
`data/database.sqlite`. Cucumber usa `cucumber.js` para cargar las features y
los pasos.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/v1/tareas` | Listar, filtrar y paginar tareas |
| POST | `/api/v1/tareas` | Crear tarea |
| GET | `/api/v1/tareas/:id` | Buscar tarea por ID |
| PUT/PATCH | `/api/v1/tareas/:id` | Reemplazar o modificar tarea |
| DELETE | `/api/v1/tareas/:id` | Eliminar tarea |
| GET | `/api/v1/categorias` | Listar, filtrar y paginar categorías |
| POST | `/api/v1/categorias` | Crear categoría |
| GET | `/api/v1/categorias/:id` | Buscar categoría por ID |
| PUT/PATCH | `/api/v1/categorias/:id` | Reemplazar o modificar categoría |
| DELETE | `/api/v1/categorias/:id` | Eliminar categoría |

Las tareas aceptan `titulo` (obligatorio), `prioridad` (`baja`, `media` o
`alta`; por defecto `media`) y `categoriaId` (opcional). Las categorías aceptan
`nombre` (obligatorio y único) y `descripcion` (opcional).

Las colecciones se devuelven como `{ "data": [], "meta": {} }`. Se pueden usar
`page` y `limit` (máximo 100), además de `titulo`, `prioridad` y `categoriaId`
para filtrar tareas, o `nombre` para filtrar categorías. Los IDs inválidos
devuelven `400`, los recursos inexistentes `404`, las validaciones `422`, los
conflictos de nombre `409`, la creación exitosa `201` y el borrado exitoso
`204`.

## Pruebas manuales con curl

```sh
curl -i http://localhost:3000/api/v1/tareas

curl -i \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudiar API","prioridad":"alta"}' \
  http://localhost:3000/api/v1/tareas

curl -i http://localhost:3000/api/v1/tareas/1
curl -i "http://localhost:3000/api/v1/tareas?prioridad=alta&page=1&limit=10"
```

En PowerShell, si el quoting del shell altera el JSON de `-d`, se puede guardar
el cuerpo en un archivo temporal y pasar su ruta a curl:

```powershell
$payload = Join-Path $env:TEMP 'tarea.json'
Set-Content -Path $payload -Value '{"titulo":"Estudiar API","prioridad":"alta"}' -Encoding ascii -NoNewline
curl.exe -i -X POST -H "Content-Type: application/json" --data-binary "@$payload" http://localhost:3000/api/v1/tareas
Remove-Item -LiteralPath $payload
```
