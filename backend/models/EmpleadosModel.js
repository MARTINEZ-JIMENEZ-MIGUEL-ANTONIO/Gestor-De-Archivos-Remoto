// models/EmpleadosModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Empleados = db.define('Empleados', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    cargo: {
        type: DataTypes.STRING
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2)
    },
    fecha_contrato: {
        type: DataTypes.DATE
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();
 

export default Empleados;
