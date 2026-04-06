const request = require("supertest");
const app = require("../index"); 

describe("Pruebas de rutas del Marketplace", () => {
  
  // Test 1: Ver productos (GET)
  it("GET /productos deberia devolver un codigo 200", async () => {
    const response = await request(app).get("/productos").send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  // Test 2: Registrar usuario (POST)
  it("POST /usuarios deberia devolver 201 al crear usuario", async () => {
    const nuevoUsuario = {
      email: `test${Math.random()}@tiendita.cl`, 
      password: "123",
      nombre: "Test Jest",
      avatar: "url"
    };
    const response = await request(app).post("/usuarios").send(nuevoUsuario);
    expect(response.statusCode).toBe(201);
  });

  // Test 3: Login (POST)
  it("POST /login deberia devolver un token con credenciales correctas", async () => {
    
    const credentials = { email: "jest@test.cl", password: "123" };
    await request(app).post("/usuarios").send({...credentials, nombre: "Test", avatar: "url"});
    
    const response = await request(app).post("/login").send(credentials);
    expect(response.statusCode).toBe(200);
    expect(typeof response.text).toBe("string");
  });

  // Test 4: Ruta inexistente (404)
  it("Deberia devolver 404 al intentar entrar a una ruta que no existe", async () => {
    const response = await request(app).get("/ruta-fantasma").send();
    expect(response.statusCode).toBe(404);
  });
});