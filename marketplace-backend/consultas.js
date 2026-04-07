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

// 1. Funcion para Registrar Usuario
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

const verificarUsuario = async (email, password) => {
  const values = [email];
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await pool.query(query, values);

  if (!rowCount) throw { code: 401, message: "Email incorrecto" };

  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordEsCorrecta) throw { code: 401, message: "Contraseña incorrecta" };
};

module.exports = { registrarUsuario, getProductos, verificarUsuario };
