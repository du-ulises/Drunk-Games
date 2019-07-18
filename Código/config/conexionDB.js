const mysql = require('mysql');

// Exportamos la conexion
module.exports = () => {
    return mysql.createConnection({
        host: process.env.SQLHOST,
        user: process.env.SQLUSER,
        password: process.env.SQLPASS,
        database: process.env.SQLDB
    });
}