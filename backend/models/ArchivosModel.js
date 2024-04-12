// models/ArchivosModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Archivos = db.define('Archivos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    ruta: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});
(async () => {
    await db.sync();
})();

export default Archivos;
