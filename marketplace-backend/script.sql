-- creacion de la base de datos
CREATE DATABASE marketplace;

-- conexion a la base de datos
\c marketplace;

-- tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  avatar VARCHAR(255)
);

-- tabla de productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL,
  descripcion TEXT,
  img VARCHAR(255),
  usuario_id INT REFERENCES usuarios(id)
);