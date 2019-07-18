const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('../config/conexionDB');

module.exports = app => {

    /* Ruta para renderizar la pagina de login de los administradores */
    app.get('/login_admins', (req, res) => {
        res.render('login_admin');
    });

    // Solicitud post para recibir los datos del login administrador
    app.post('/login_admins', (req, res) => {
        // Abrimos la conexion mysql
        const conn = mysql();
        // Destructuramos el objeto JSON que el cliente envio
        let { usuario, password } = req.body;

        // Realizamos la conexion mysql buscando si el usuario existe y esta activo
        conn.query(`SELECT * FROM admins WHERE usuario = ? AND estado = 1`, [usuario], (err, result) => {
            // En caso de algun error en la consulta cerramos la conexion
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err: 'Error interno del servidor, contacte a soporte'
                });
            }

            // Si existe almenos un usuario con ese nombre preguntamos el pass coincide
            if (result.length > 0 && bcrypt.compareSync(password, result[0].pass)) {
                // Generamos un token
                let token = jwt.sign({
                    userLog: {
                        id: result[0].id,
                        usuario,
                        nombre: result[0].nombre
                    }
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                // Cerramos la conexion y enviamos la respuesta al cliente
                conn.end(function() {});
                return res.json({
                    ok: true,
                    token
                });
            }

            // Si el usuario no existe o el pass no coincide enviamos el error.
            res.json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            });
            conn.end(function() {});
        });
    });

    // Renderiza la pagina para el CRUD de admins
    app.get('/view_admins', (req, res) => {
        res.render('admins');
    });
    
    // Regresa la lista de los admins activos de la BD
    app.get('/admins', (req, res) => {
        const conn = mysql();

        conn.query('SELECT id, usuario, nombre FROM admins WHERE estado = 1', (err, result) => {
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                data: result
            });
            conn.end(function() {});
        });
    });

    // Request post para dar de alta nuevos administradores
    app.post('/admins', (req, res) => {

        const conn = mysql();
        let { usuario, nombre, pass } = req.body;

        // Encriptamos la contraseña con la libreria bcrypt con una dificultad de nivel 10
        pass = bcrypt.hashSync(pass, 10);

        // Insertamos los datos a la BD
        conn.query(`INSERT INTO admins SET?`, {
            usuario,
            nombre,
            pass,
            estado: 1
        }, (err, result) => {
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true
            });
            conn.end(function() {});
        });
    });

    // Request para actualizar los datos del administrador
    app.put('/admins', (req, res) => {
        const conn = mysql();
        let { usuario, nombre, pass, id } = req.body;
        pass = bcrypt.hashSync(pass, 10);

        conn.query('UPDATE admins SET usuario = ?, nombre = ?, pass = ? WHERE id = ?', [usuario, nombre, pass, id], (err, result) => {
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true
            });
            conn.end(function() {});
        });
    });

    // Request para eliminar un administrador
    app.delete('/admins/:id', (req, res) => {
        const conn = mysql();
        let id = req.params.id;

        conn.query('UPDATE admins SET estado = 0 WHERE id = ?', [id], (err, result) => {
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true
            });
            conn.end(function() {});
        });
    });
}