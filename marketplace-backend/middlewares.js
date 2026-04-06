const jwt = require("jsonwebtoken");
require("dotenv").config();

const validarToken = (req, res, next) => {

  const authorizationHeader = req.header("Authorization");
  
  if (!authorizationHeader) {
    return res.status(401).send("No se proporciono un token de acceso");
  }


  const token = authorizationHeader.split("Bearer ")[1];

  try {
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next(); 
  } catch (error) {
    res.status(401).send("Token invalido o expirado");
  }
};

module.exports = { validarToken };