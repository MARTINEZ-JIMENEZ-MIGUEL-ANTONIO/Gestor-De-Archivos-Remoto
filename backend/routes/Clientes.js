// routes/Clientes.js
import express from "express";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../controllers/Clientes";

const router = express.Router();

router.get('/Clientes', getClientes);
router.post('/Clientes', createCliente);
router.put('/Clientes/:id', updateCliente);
router.delete('/Clientes/:id', deleteCliente);

export default router;
