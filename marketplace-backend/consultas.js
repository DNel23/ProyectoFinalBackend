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
  ssl: { rejectUnauthorized: false }
});

// 1. Registrar Usuario
const registrarUsuario = async (usuario) => {
  const { email, password, nombre, avatar } = usuario;
  const passwordEncriptada = bcrypt.hashSync(password);
  const values = [email, passwordEncriptada, nombre, avatar];
  const query = "INSERT INTO usuarios (email, password, nombre, avatar) VALUES ($1, $2, $3, $4)";
  await pool.query(query, values);
};

// 2. Obtener productos
const getProductos = async () => {
  const { rows } = await pool.query("SELECT * FROM productos ORDER BY id DESC");
  return rows;
};

// 3. Verificar Usuario (Login)
const verificarUsuario = async (email, password) => {
  const values = [email];
  const query = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await pool.query(query, values);
  if (!rowCount) throw { code: 401, message: "Email incorrecto" };
  const isCorrect = bcrypt.compareSync(password, usuario.password);
  if (!isCorrect) throw { code: 401, message: "Contraseña incorrecta" };
};

// 4. Obtener datos del perfil
const obtenerUsuario = async (email) => {
  const query = "SELECT id, email, nombre, avatar FROM usuarios WHERE email = $1";
  const { rows: [usuario] } = await pool.query(query, [email]);
  return usuario;
};

// 5. PUBLICAR PRODUCTO (Aquí estaba el error 500)
const publicarProducto = async (producto) => {
  const { nombre, descripcion, precio, imagen, email } = producto;
  
  // Primero buscamos el ID real del usuario en Neon
  const userQuery = "SELECT id FROM usuarios WHERE email = $1";
  const { rows: [user] } = await pool.query(userQuery, [email]);

  if (!user) throw new Error("Usuario no encontrado");

  // INSERT explícito para evitar errores de estructura
  // NOTA: Si tu columna se llama user_id en vez de usuario_id, cámbialo aquí abajo:
  const query = "INSERT INTO productos (nombre, descripcion, precio, imagen, usuario_id) VALUES ($1, $2, $3, $4, $5)";
  const values = [nombre, descripcion, precio, imagen, user.id];
  
  await pool.query(query, values);
};

module.exports = { registrarUsuario, getProductos, verificarUsuario, obtenerUsuario, publicarProducto };
