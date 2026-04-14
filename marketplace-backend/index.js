const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// Agregamos 'publicarProducto' a las consultas
const { registrarUsuario, getProductos, verificarUsuario, obtenerUsuario, publicarProducto } = require('./consultas');
const app = express();
const PORT = 3000;
const { validarToken } = require("./middlewares");

app.use(cors()); 
app.use(express.json()); 

// 1. Registro
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    res.status(500).send({ message: "Error al registrar usuario", error: error.message });
  }
});

// 2. Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarUsuario(email, password);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send(token);
  } catch (error) {
    res.status(error.code || 500).send(error.message);
  }
});

// 3. Perfil (Protegido)
app.get("/perfil", validarToken, async (req, res) => {
  try {
    const { email } = req.user;
    const usuario = await obtenerUsuario(email);
    if (!usuario) return res.status(404).send("Usuario no encontrado");
    res.json({ user: usuario });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

// 4. Obtener Productos (Público)
app.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos); 
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

// 5. NUEVA: Publicar Producto (Privado - Requiere Token)
app.post("/productos", validarToken, async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen } = req.body;
    const { email } = req.user; // Sabemos quién publica gracias al token

    // Llamamos a la DB para insertar
    await publicarProducto({ nombre, descripcion, precio, imagen, email });
    
    res.status(201).send("Producto publicado exitosamente");
  } catch (error) {
    console.error("Error al publicar:", error);
    res.status(500).send("Error al subir el producto a la base de datos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor encendido en el puerto ${PORT}`);
});

module.exports = app;
