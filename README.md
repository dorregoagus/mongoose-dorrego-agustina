# Práctica de MongoDB y Mongoose

## Descripción

Este proyecto consiste en una API desarrollada con Node.js, Express, MongoDB y Mongoose para administrar usuarios, cursos y perfiles.

Se implementaron operaciones CRUD para las tres colecciones, validaciones con express-validator y relaciones entre los documentos. También se trabajó con propiedades embebidas, referencias, populate y eliminaciones lógicas y en cascada.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- express-validator
- dotenv

## Colecciones y relaciones

Se crearon tres colecciones: usuarios, cursos y perfiles.

### 1. Propiedad embebida

Dentro del modelo de usuario se encuentra la propiedad `direccion`, que contiene la calle y la ciudad.

Elegí guardarla como un objeto embebido porque son datos que pertenecen al usuario y no necesitan manejarse como una colección independiente. De esta forma, se pueden consultar junto con el resto de sus datos.

### 2. Relación uno a uno (1:1)

La relación entre usuarios y perfiles es de uno a uno. Cada perfil pertenece a un usuario y un usuario puede tener un solo perfil.

Para implementarla, el modelo de perfil guarda una referencia al usuario mediante su ObjectId. Elegí esta opción porque el perfil contiene información adicional que puede administrarse por separado. Además, se valida que un usuario no tenga más de un perfil.

### 3. Relación uno a muchos (1:N)

La relación entre docentes y cursos es de uno a muchos. Un docente puede tener varios cursos, pero cada curso tiene un solo docente.

La referencia al docente se guarda en el modelo de curso mediante su ObjectId. Elegí esta forma porque los cursos se administran por separado y cada uno puede recuperar los datos de su docente cuando sea necesario.

### 4. Relación muchos a muchos (N:M)

La relación entre estudiantes y cursos es de muchos a muchos. Un estudiante puede inscribirse en varios cursos y un curso puede tener varios estudiantes.

Para representarla, el modelo de curso contiene un arreglo llamado `estudiantes`, que guarda los ObjectId de los usuarios inscriptos. Elegí esta opción porque permite administrar las inscripciones sin duplicar los datos completos de cada estudiante.

## Uso de populate()

Se utilizó `populate()` para obtener información de documentos relacionados a través de sus referencias, en lugar de devolver solamente los ObjectId.

Por ejemplo, al consultar un curso se pueden obtener los datos del docente y de los estudiantes inscriptos. También se pueden consultar los cursos y el perfil relacionado con un usuario mediante las referencias virtuales definidas en el modelo.

Esto permite mostrar la información relacionada de una manera más clara y evita tener que realizar manualmente consultas separadas para cada documento.

## Eliminaciones lógicas y en cascada

Las eliminaciones lógicas se realizan cambiando el campo `activo` a `false`, en lugar de borrar directamente el documento. De esta manera, el registro se conserva en la base de datos, pero deja de aparecer en las consultas que muestran solamente documentos activos.

Al eliminar un usuario, también se actualizan sus relaciones: se desactivan los cursos en los que era docente, se lo quita de los cursos en los que estaba inscripto como estudiante y se elimina su perfil asociado.

De esta forma se evita mantener relaciones activas con un usuario que ya fue desactivado.

## Endpoint para inscribir estudiantes

Para agregar un vínculo en la relación muchos a muchos, se creó el siguiente endpoint:

`POST /api/cursos/:id/estudiantes`

Recibe el ID del curso en la URL y el ID del estudiante en el cuerpo de la petición.

Antes de realizar la inscripción, se verifica que el curso exista y esté activo, que el estudiante exista, esté activo y tenga el rol correspondiente, y que no se encuentre inscripto previamente.

Si las validaciones son correctas, se agrega el estudiante al arreglo `estudiantes` del curso y se guarda el cambio.

## Validaciones y manejo de errores

Se utilizó express-validator para validar los datos recibidos en las rutas de creación y actualización, incluyendo los campos obligatorios, los tipos de datos, las longitudes y los ObjectId.

También se implementaron validaciones personalizadas para comprobar la existencia de documentos relacionados y evitar duplicados.

Los errores de validación se manejan mediante un middleware reutilizable que utiliza `validationResult()` y responde con el código HTTP 400. En los controladores se utiliza `matchedData()` para trabajar con los datos validados y `try-catch` para manejar errores.

Se utilizan códigos HTTP como 201 para las creaciones exitosas, 200 para las consultas y actualizaciones exitosas, 400 para errores de validación, 404 cuando no se encuentra un recurso y 500 para errores inesperados.

## Instalación y ejecución

1. Clonar el repositorio.
2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.
4. Configurar las variables de entorno con los datos correspondientes.
5. Verificar que MongoDB esté funcionando.
6. Iniciar el servidor:

   ```bash
   npm run dev
   ```

El servidor utiliza el puerto definido en la variable `PORT` y se conecta a la base de datos indicada en `MONGO_URI`.

## Variables de entorno

El proyecto utiliza las siguientes variables:

- `PORT`: puerto en el que se ejecuta el servidor.
- `MONGO_URI`: dirección de conexión a MongoDB.

El archivo `.env` contiene los valores locales y no debe subirse al repositorio. Para compartir los nombres de las variables necesarias se utiliza `.env.example`.

