// controller/Archivos.js
import Archivos from "../models/ArchivosModel.js";

export const getArchivos = async (req, res) => {
    try {
        const archivos = await Archivos.findAll();
        res.json(archivos);
    } catch (error) {
        console.error("Error al obtener archivos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const createArchivo = async (req, res) => {
    const { nombre, ruta, tipo } = req.body;
    try {
        const archivo = await Archivos.create({
            nombre: nombre,
            ruta: ruta,
            tipo: tipo
        });
        res.status(201).json(archivo);
    } catch (error) {
        console.error("Error al insertar archivo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateArchivo = async (req, res) => {
    const { id } = req.params;
    const { nombre, ruta, tipo } = req.body;
    try {
        await Archivos.update({
            nombre: nombre,
            ruta: ruta,
            tipo: tipo
        }, {
            where: { id: id }
        });
        res.status(200).json({ msg: "Archivo actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar archivo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteArchivo = async (req, res) => {
    const { id } = req.params;
    try {
        await Archivos.destroy({
            where: { id: id }
        });
        res.status(200).json({ msg: "Archivo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar archivo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
