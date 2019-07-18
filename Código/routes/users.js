const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('../config/conexionDB');

module.exports = app => {

    app.get('/registro', (req, res) => {
        res.render('users/nuevo', {
            titulo: 'Registro'
        });
    });

    app.get('/mi_perfil', (req, res) => {
        res.render('users/perfil', {
            titulo: 'Perfil'
        });
    });

    app.get('/editar_user', (req, res) => {
        res.render('users/edit', {
            titulo: 'Perfil'
        });
    });

    app.get('/perfil_datos/:id', (req, res) => {
        const conn = mysql();
        let id = req.params.id;
        conn.query('SELECT * FROM users WHERE estado = 1 AND id = ?', [id], (err, result) => {
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

    // Renderiza la pagina de login para usuarios
    app.get('/login_user', (req, res) => {
        res.render('users/login_user');
    });

    // Peticion post para dar de alta un nuevo usuario
    app.post('/login_users', (req, res) => {
        // Abrimos la conexion mysql
        const conn = mysql();
        // Destructuramos el objeto con los datos que envio el cliente
        let { usuario, password } = req.body;

        // Hacemos la consulta a la bd para ver si el usuario existe y esta activo
        conn.query(`SELECT * FROM users WHERE usuario = ? AND estado = 1`, [usuario], (err, result) => {

            // En caso de haber algun error en la consulta cerramos la conexion
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err: 'Error interno del servidor, contacte a soporte'
                });
            }

            // Si hay almenos algun resultado y la contraseña coincide
            if (result.length > 0 && bcrypt.compareSync(password, result[0].pass)) {
                // Generamos un token
                let token = jwt.sign({
                    userLog: {
                        id: result[0].id,
                        usuario,
                        nombre: result[0].nombre
                    }
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                // Cerramos la conexion y le enviamos los datos al cliente en un JSON
                conn.end(function() {});
                return res.json({
                    ok: true,
                    data: {
                        id: result[0].id,
                        nombre: result[0].nombre
                    },
                    token
                });
            }

            // Enviamos la respuesta al cliente en caso de que algun dato no coincida
            res.json({
                ok: false,
                err: 'Usuario o contraseña incorrectos'
            });
            conn.end(function() {});
        });
    });

    app.get('/users', (req, res) => {
        const conn = mysql();

        conn.query('SELECT * FROM users WHERE estado = 1', (err, result) => {
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

    app.post('/users', (req, res) => {
        const conn = mysql();
        let { 
            usuario,
            nombre,
            paterno,
            materno,
            email,
            telefono,
            pass,
            calle,
            colonia,
            numero,
            codigoPostal,
            fechaNac,
            estatura,
            peso,
            tipoSangre,
            aceptoTerminos, 
        } = req.body;

        pass = bcrypt.hashSync(pass, 10);
        conn.query(`INSERT INTO users (usuario,nombre
            ,paterno,materno,email,telefono,pass,calle,
            colonia,numero,codigoPostal,fechaNac,estatura,peso,tipoSangre,aceptoTerminos,estado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
            [usuario,nombre,paterno,materno,email,telefono,pass,calle,colonia,numero,codigoPostal,
            fechaNac,estatura,peso,tipoSangre,aceptoTerminos,1], (err, result) => {
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

    app.put('/users', (req, res) => {
        const conn = mysql();
        let { 
            usuario,
            nombre,
            paterno,
            materno,
            email,
            telefono,
            pass,
            calle,
            colonia,
            numero,
            codigoPostal,
            fechaNac,
            estatura,
            peso,
            tipoSangre,
            aceptoTerminos,
            id 
        } = req.body;

        fechaNac = fechaNac.split(",");

        pass = bcrypt.hashSync(pass, 10);


        conn.query(`UPDATE users SET 
                usuario = ?,
                nombre = ?,
                paterno = ?,
                materno = ?,
                email = ?,
                telefono = ?,
                pass = ?,
                calle = ?,
                colonia = ?,
                numero = ?,
                codigoPostal = ?,
                fechaNac = ?,
                estatura = ?,
                peso = ?,
                tipoSangre = ?,
                aceptoTerminos = ? 
                WHERE id = ?`, [
                usuario,
                nombre,
                paterno,
                materno,
                email,
                telefono,
                pass,
                calle,
                colonia,
                numero,
                codigoPostal,
                fechaNac,
                estatura,
                peso,
                tipoSangre,
                aceptoTerminos,
                id], (err, result) => {
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

    app.delete('/users/:id', (req, res) => {
        const conn = mysql();
        let { id } = req.body;

        conn.query('UPDATE users SET estado = 0 WHERE id = ?', [id], (err, result) => {
            if (err) {
                conn.end(function() {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                result
            });
            conn.end(function() {});
        });
    });
}