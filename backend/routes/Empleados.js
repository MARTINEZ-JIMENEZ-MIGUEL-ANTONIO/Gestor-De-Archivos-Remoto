// routes/Empleados.js
import express from "express";
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from "../controllers/Empleados.js";

const router = express.Router();

router.get('/Empleados', getEmpleados);
router.post('/Empleados', createEmpleado);
router.put('/Empleados/:id', updateEmpleado);
router.delete('/Empleados/:id', deleteEmpleado);

export default router;
