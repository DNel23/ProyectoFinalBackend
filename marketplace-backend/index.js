const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { registrarUsuario, getProductos, verificarUsuario } = require('./consultas');
const app = express();
const PORT = 3000;
const { validarToken } = require("./middlewares");

// Middlewares globales
app.use(cors()); 
app.use(express.json()); 

// Ruta para Registrar Usuario
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    await registrarUsuario(usuario);
    res.status(201).send("Usuario registrado con éxito");
  } catch (error) {
    res.status(500).send({ message: "Error al registrar usuario", error: error.message });
  }
});

// Ruta PRIVADA: Solo entra si el token es valido
app.get("/perfil", validarToken, async (req, res) => {
  try {
    const { email } = req.user; // Datos que vienen del middleware
    // Aqui podriamos buscar mas info en la DB con el email si fuera necesario
    res.json({ message: `Bienvenido al marketplace, ${email}`, user: req.user });
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
});

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

// Ruta para obtener productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos); 
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor encendido en http://localhost:${PORT}`);
});


module.exports = app;