# marketplace (hito 3 - backend)

este proyecto consiste en el desarrollo del servidor de la aplicacion, encargado de gestionar la base de datos postgresql, la seguridad con jwt y las pruebas automatizadas.

## tecnologias y librerias
* node.js & express: levantamiento del servidor api rest.
* pg (node-postgres): gestion de consultas y conexion con la base de datos postgresql.
* jsonwebtoken (jwt): implementacion de autenticacion y autorizacion para rutas protegidas.
* bcryptjs: encriptacion de contrasenas para un almacenamiento seguro.
* cors: habilitacion de consultas de origenes cruzados para la futura conexion con el frontend.
* jest & supertest: realizacion de pruebas unitarias y de integracion.

## puntos clave evaluados
1. arquitectura modular: separacion de logica en archivos index.js, consultas.js y middlewares.js.
2. base de datos: gestion de tablas de usuarios y productos con integridad referencial.
3. seguridad: uso de middlewares para validar el token bearer en la cabecera authorization.
4. validacion de rutas: implementacion de login con verificacion de credenciales encriptadas.

## como ejecutar el proyecto
1. clonar el repositorio.
2. crear base de datos marketplace en postgres y ejecutar el archivo script.sql.
3. configurar el archivo .env con las credenciales de tu postgres local (host, user, password, database, port) y una jwt_secret.
4. instalar dependencias:
   npm install
5. iniciar el servidor:
   npm run dev

## pruebas automatizadas
para validar los requisitos de la rubrica, se incluyeron tests para 4 rutas principales:
1. get /productos 
2. post /usuarios 
3. post /login 
4. ruta inexistente 

ejecutar pruebas con:
npm run test