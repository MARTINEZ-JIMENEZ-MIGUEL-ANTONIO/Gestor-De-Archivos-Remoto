// controller/Empleados.js
import Empleados from "../models/EmpleadosModel.js";

export const getEmpleados = async (req, res) => {
    try {
        const empleados = await Empleados.findAll();
        res.json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const createEmpleado = async (req, res) => {
    const { nombre, cargo, salario, fecha_contrato } = req.body;
    try {
        const empleado = await Empleados.create({
            nombre: nombre,
            cargo: cargo,
            salario: salario,
            fecha_contrato: fecha_contrato
        });
        res.status(201).json(empleado);
    } catch (error) {
        console.error("Error al insertar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, cargo, salario, fecha_contrato } = req.body;
    try {
        await Empleados.update({
            nombre: nombre,
            cargo: cargo,
            salario: salario,
            fecha_contrato: fecha_contrato
        }, {
            where: { id: id }
        });
        res.status(200).json({ msg: "Empleado actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        await Empleados.destroy({
            where: { id: id }
        });
        res.status(200).json({ msg: "Empleado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
