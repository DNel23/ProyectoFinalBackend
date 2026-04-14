const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  allowExitOnIdle: true,
  ssl: {
    rejectUnauthorized: false
  }
});

// 1. Función para Registrar Usuario
const registrarUsuario = async (usuario) => {
  let { email, password, nombre, avatar } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password); // Encripta la clave
  const values = [email, passwordEncriptada, nombre, avatar];
  const query = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  await pool.query(query, values);
};

// 2. Función para obtener productos 
const getProductos = async () => {
  const { rows } = await pool.query("SELECT * FROM productos");
  return rows;
};

// 3. Función para verificar credenciales en el Login
const verificarUsuario = async (email, password) => {
  const values = [email];
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await pool.query(query, values);

  if (!rowCount) throw { code: 401, message: "Email incorrecto" };

  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordEsCorrecta) throw { code: 401, message: "Contraseña incorrecta" };
};

// 4. NUEVA: Función para obtener los datos completos del usuario (nombre, etc.)
// Esta es la que usa la ruta /perfil para alimentar el frontend
const obtenerUsuario = async (email) => {
  const query = "SELECT email, nombre, avatar FROM usuarios WHERE email = $1";
  const values = [email];
  const { rows: [usuario] } = await pool.query(query, values);
  return usuario;
};

// Exportamos todas las funciones
module.exports = { 
  registrarUsuario, 
  getProductos, 
  verificarUsuario, 
  obtenerUsuario 
};
