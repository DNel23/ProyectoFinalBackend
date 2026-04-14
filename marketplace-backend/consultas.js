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

// ... (registrarUsuario, getProductos, verificarUsuario, obtenerUsuario se mantienen igual) ...

const publicarProducto = async (producto) => {
  const { nombre, descripcion, precio, imagen, email } = producto;
  
  try {
    // 1. Buscamos el ID del usuario
    const userQuery = "SELECT id FROM usuarios WHERE email = $1";
    const { rows: [user] } = await pool.query(userQuery, [email]);

    if (!user) throw new Error("Usuario no encontrado en la DB");

    // 2. INSERT (OJO AQUÍ: Revisa si tus columnas se llaman exactamente así)
    // Si en tu script.sql pusiste 'user_id' en vez de 'usuario_id', cámbialo abajo.
    const query = "INSERT INTO productos (nombre, descripcion, precio, imagen, usuario_id) VALUES ($1, $2, $3, $4, $5)";
    const values = [nombre, descripcion, precio, imagen, user.id];
    
    await pool.query(query, values);
    return true;
  } catch (error) {
    // ESTO ES LO QUE VERÁS EN RENDER:
    console.error("--- ERROR CRÍTICO EN SQL ---");
    console.error("Mensaje:", error.message);
    console.error("Detalle:", error.detail);
    console.error("Tabla/Columna con problemas:", error.column);
    throw error; 
  }
};

// Asegúrate de que TODOS estén aquí
module.exports = { registrarUsuario, getProductos, verificarUsuario, obtenerUsuario, publicarProducto };
