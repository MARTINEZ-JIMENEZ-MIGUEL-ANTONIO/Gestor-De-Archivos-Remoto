const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Conexión con la base de datos
const { connection } = require("../config/config.db");

// Middleware para analizar JSON
app.use(express.json());

// Ruta para obtener empleados
app.get("/Empleados", (request, response) => {
    connection.query("SELECT * FROM empleados", (error, results) => {
        if (error) {
            console.error("Error al obtener empleados:", error);
            response.status(500).json({ error: "Error interno del servidor" });
        } else {
            response.status(200).json(results);
        }
    });
});

module.exports = app;