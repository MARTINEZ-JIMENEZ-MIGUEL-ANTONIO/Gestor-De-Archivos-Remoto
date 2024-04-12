// controller/Clientes.js
import Clientes from "../models/ClientesModel.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Clientes.findAll();
        res.json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const createCliente = async (req, res) => {
    const { nombre, email, telefono } = req.body;
    try {
        const cliente = await Clientes.create({
            nombre: nombre,
            email: email,
            telefono: telefono
        });
        res.status(201).json(cliente);
    } catch (error) {
        console.error("Error al insertar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    try {
        await Clientes.update({
            nombre: nombre,
            email: email,
            telefono: telefono
        }, {
            where: { id: id }
        });
        res.status(200).json({ msg: "Cliente actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        await Clientes.destroy({
            where: { id: id }
        });
        res.status(200).json({ msg: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
