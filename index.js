const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cargamos el archivo de rutas
app.use(require('./Routes/Empleados'));
// app.use(require('./routes/materias'));

const PORT = process.env.PORT || 5000; // Usar el puerto 5000 si no se proporciona un valor en la variable de entorno
app.listen(PORT, () => {
    console.log('El servidor escucha en el puerto ' + PORT);
});
module.exports = app;