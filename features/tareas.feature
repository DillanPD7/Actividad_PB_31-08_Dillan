# language: es
Característica: Gestión de tareas
  Para organizar el trabajo
  Como cliente de la API
  Quiero gestionar tareas mediante HTTP

  Antecedentes:
    Dado que la API está iniciada con datos mock

  Escenario: Listar las tareas
    Cuando envío una petición GET a "/api/v1/tareas"
    Entonces la respuesta tiene estado 200
    Y la colección contiene 2 elementos
    Y la respuesta incluye una tarea con título "Estudiar API"

  Escenario: Crear una tarea válida
    Cuando envío una petición POST a "/api/v1/tareas" con el cuerpo:
      """
      {"titulo":"Preparar entrega","prioridad":"alta"}
      """
    Entonces la respuesta tiene estado 201
    Y el recurso devuelto tiene el campo "titulo" igual a "Preparar entrega"

  Escenario: Rechazar la creación sin título
    Cuando envío una petición POST a "/api/v1/tareas" con el cuerpo:
      """
      {"prioridad":"alta"}
      """
    Entonces la respuesta tiene estado 422

  Escenario: Consultar una tarea existente
    Cuando envío una petición GET a "/api/v1/tareas/1"
    Entonces la respuesta tiene estado 200
    Y el recurso devuelto tiene el campo "titulo" igual a "Estudiar API"

  Escenario: Consultar un ID inexistente
    Cuando envío una petición GET a "/api/v1/tareas/999"
    Entonces la respuesta tiene estado 404

  Escenario: Rechazar un ID inválido
    Cuando envío una petición GET a "/api/v1/tareas/no-es-un-id"
    Entonces la respuesta tiene estado 400

  Escenario: Modificar un campo válido
    Cuando envío una petición PATCH a "/api/v1/tareas/1" con el cuerpo:
      """
      {"prioridad":"baja"}
      """
    Entonces la respuesta tiene estado 200
    Y el recurso devuelto tiene el campo "prioridad" igual a "baja"

  Escenario: Eliminar una tarea existente
    Cuando envío una petición DELETE a "/api/v1/tareas/1"
    Entonces la respuesta tiene estado 204

  Escenario: Filtrar tareas por prioridad
    Cuando envío una petición GET a "/api/v1/tareas?prioridad=alta"
    Entonces la respuesta tiene estado 200
    Y la colección contiene 1 elementos
    Y la respuesta incluye una tarea con título "Estudiar API"

  Escenario: Solicitar una página sin resultados
    Cuando envío una petición GET a "/api/v1/tareas?page=10&limit=2"
    Entonces la respuesta tiene estado 200
    Y la colección contiene 0 elementos
    Y la respuesta incluye metadatos de paginación para la página 10

  Escenario: Invocar una ruta desconocida
    Cuando envío una petición GET a "/api/v1/no-existe"
    Entonces la respuesta tiene estado 404
