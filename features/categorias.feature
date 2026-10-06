# language: es
Característica: Gestión de categorías
  Para clasificar tareas
  Como cliente de la API
  Quiero gestionar categorías mediante HTTP

  Antecedentes:
    Dado que la API está iniciada con datos mock

  Escenario: Listar categorías mock
    Cuando envío una petición GET a "/api/v1/categorias"
    Entonces la respuesta tiene estado 200
    Y la colección contiene 2 elementos

  Escenario: Crear una categoría
    Cuando envío una petición POST a "/api/v1/categorias" con el cuerpo:
      """
      {"nombre":"Estudio","descripcion":"Materias y prácticas"}
      """
    Entonces la respuesta tiene estado 201
    Y el recurso devuelto tiene el campo "nombre" igual a "Estudio"

  Escenario: Consultar una categoría por ID
    Cuando envío una petición GET a "/api/v1/categorias/1"
    Entonces la respuesta tiene estado 200
    Y el recurso devuelto tiene el campo "nombre" igual a "Personal"

  Escenario: Modificar una categoría
    Cuando envío una petición PATCH a "/api/v1/categorias/1" con el cuerpo:
      """
      {"nombre":"Vida personal"}
      """
    Entonces la respuesta tiene estado 200
    Y el recurso devuelto tiene el campo "nombre" igual a "Vida personal"

  Escenario: Eliminar una categoría
    Cuando envío una petición DELETE a "/api/v1/categorias/2"
    Entonces la respuesta tiene estado 204

  Escenario: Rechazar la creación de una categoría sin nombre
    Cuando envío una petición POST a "/api/v1/categorias" con el cuerpo:
      """
      {"descripcion":"Sin nombre"}
      """
    Entonces la respuesta tiene estado 422
