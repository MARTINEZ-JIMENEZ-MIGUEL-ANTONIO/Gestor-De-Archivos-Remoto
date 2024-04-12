import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { getArchivos, createArchivo, updateArchivo, deleteArchivo } from "../controllers/Archivos.js";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../controllers/Clientes.js";
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from "../controllers/Empleados.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

// Rutas para Usuarios
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

router.get('/archivos', getArchivos);
router.post('/archivos', createArchivo);
router.put('/archivos/:id', updateArchivo);
router.delete('/archivos/:id', deleteArchivo);

router.get('/clientes', getClientes);
router.post('/clientes', createCliente);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

router.get('/empleados', getEmpleados);
router.post('/empleados', createEmpleado);
router.put('/empleados/:id', updateEmpleado);
router.delete('/empleados/:id', deleteEmpleado);

export default router;
