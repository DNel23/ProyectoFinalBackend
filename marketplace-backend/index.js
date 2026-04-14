const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { registrarUsuario, getProductos, verificarUsuario, obtenerUsuario } = require('./consultas');
const app = express();
const PORT = 3000;
const { validarToken } = require("./middlewares");

// Middlewares globales
app.use(cors()); 
app.use(express.json()); 

// 1. Ruta para Registrar Usuario
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    res.status(500).send({ message: "Error al registrar usuario", error: error.message });
  }
});

// 2. Ruta para Login (Genera el Token JWT)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarUsuario(email, password);
    
    // Creamos el token usando la clave secreta de tus variables de entorno en Render
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.send(token);
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
});

// 3. Ruta PRIVADA: Obtiene el perfil completo desde la Base de Datos
// Esta ruta es la que evita la pantalla blanca en el frontend
app.get("/perfil", validarToken, async (req, res) => {
  try {
    const { email } = req.user; // El email viene del token decodificado por el middleware
    
    // Buscamos al usuario en Neon para traer su nombre y avatar
    const usuario = await obtenerUsuario(email);
    
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado en la base de datos");
    }
    
    // Enviamos el objeto 'user' que espera tu Perfil.jsx
    res.json({ user: usuario });
  } catch (error) {
    console.error("Error en la ruta /perfil:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// 4. Ruta para obtener productos (Marketplace)
app.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos); 
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});

module.exports = app;
