const mysql = require('../config/conexionDB');

module.exports = app => {

    app.get('/', (req, res) => {
        res.render('index', {
            titulo: 'Incio'
        });
    });
}