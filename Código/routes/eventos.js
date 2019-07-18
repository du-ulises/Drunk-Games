const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const mysql = require('../config/conexionDB');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVw_E0rEX6nvUElf3wmyAcOf6un8XQOf_1Lwlcdy8EbcOikaDDNFBlRgSH0JaJNuFgKVfjiQTf8Y10b3',
    'client_secret': 'EL3VCSYFYsHITvmtbwY2pIC2__zK5Lw-vfuuyeGPBaeU6VtmKiQ3XuPoi3gS9n7wf2CGhA6d7_7GSGHy'
});

module.exports = app => {

    app.get('/view_eventos', (req, res) => {
        res.render('eventos/eventos', {
            titulo: 'Eventos'
        });
    });

    app.get('/new_eventos', (req, res) => {
        res.render('eventos/nuevo', {
            titulo: 'Eventos'
        });
    });

    app.get('/editar_eventos', (req, res) => {
        res.render('eventos/editar', {
            titulo: 'Eventos'
        });
    });

    app.get('/edit_eventos/:id', (req, res) => {
        const conn = mysql();
        let id = req.params.id;
        conn.query('SELECT * FROM eventos WHERE estado = 1 AND id = ?', [id], (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                data: result
            });
            conn.end(function () {});
        });
    });


    app.get('/eventos', (req, res) => {
        const conn = mysql();

        conn.query('SELECT * FROM eventos WHERE estado = 1', (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                data: result
            });
            conn.end(function () {});
        });
    });

    app.get('/eventosUser/:id', (req, res) => {
        const conn = mysql();
        let id = req.params.id;

        sql = 'SELECT  eu.fk_evento, eu.tipoAsistencia, eu.transaccion, ev.titulo, ev.fecha, ev.lugar, ev.descripcion, ev.img, ev.lat, ev.lng FROM usuarios_eventos AS eu INNER JOIN users AS us ON eu.fk_user = us.id INNER JOIN  eventos AS ev ON eu.fk_evento = ev.id WHERE us.id = ?'
        conn.query(sql,[id],(err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                data: result
            });
            conn.end(function () {});
        });
    });

    app.post('/eventos', (req, res) => {

        let imagen = req.files.imagen;
        imagen.mv(`./public/img/eventos/${imagen.name}`, err => {
            if (err) return res.status(500).send({
                message: err
            });
        });

        const conn = mysql();

        let { titulo, lugar, fecha, precio, descripcion, lat, lng, img } = req.body;
        img = imagen.name;

        let query = `INSERT INTO eventos 
        (titulo, lugar, fecha, precio, descripcion, lat, lng, img, estado) 
        VALUES (?,?,?,?,?,?,?,?,?)`;

        conn.query(query, [titulo, lugar, fecha, precio, descripcion, lat, lng, img, 1], (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err: 'Error al ejecutar la consulta'
                });
            }
            conn.end(function () {});
            return res.json({
                ok: true,
                result
            });
        });
    });

    app.put('/eventos', (req, res) => {
        const conn = mysql();
        let {
            titulo,
            lugar,
            fecha,
            precio,
            descripcion,
            img,
            lat,
            lng,
            id
        } = req.body;

        conn.query(`UPDATE eventos SET 
            titulo = ?, 
            fecha = ?, 
            lugar = ?,
            descripcion = ?,
            precio = ?,
            img = ? ,
            lat = ?,
            lng = ?
            WHERE id = ?`, [titulo, fecha, lugar, descripcion, precio, img, lat, lng, id],
            (err, result) => {
                if (err) {
                    conn.end(function () {});
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    result
                });
                conn.end(function () {});
            });
    });

    app.delete('/eventos/:id', (req, res) => {
        const conn = mysql();
        let id = req.params.id;

        conn.query('DELETE FROM usuarios_eventos WHERE fk_evento = ?', [id], (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            conn.query('DELETE FROM eventos WHERE id = ?', [id], (err, result) => {
                if (err) {
                    conn.end(function () {});
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                conn.end(function () {});
                if (result.affectedRows > 0) {
                    res.json({
                        ok: true,
                        result
                    });

                } else {
                    res.json({
                        ok: false,
                        message: 'No se elimino'
                    });
                }
            });
        });


    });

    //Aqui empieza a crear la transaccion de paypal
    app.post('/eventos/participar', (req, res) => {

        let {
            idPersona,
            idEvento,
            tipoAsistencia
        } = req.body;

        const conn = mysql();

        conn.query(`SELECT * FROM eventos WHERE id = ?`, [idEvento], (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            conn.end(function () {});

            let { titulo, descripcion, precio } = result[0];
            /* 
            * Creamos un JSON con todos los datos de la transaccion para paypal
            * Indicamos a que URL debe redireccionar Paypal una vez finalizada la transaccion
            *  En caso de que el usuario cancele, tambien se define una URL, en este caso Home   
            */
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `http://localhost:3000/success/${idPersona}/${idEvento}/${tipoAsistencia}/${precio}`,
                    "cancel_url": "http://localhost:3000/"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": titulo,
                            "sku": '001',
                            "price": precio,
                            "currency": "MXN",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "MXN",
                        "total": precio
                    },
                    "description": descripcion
                }]
            };
            /*
            *  Creamos la transaccion y redireccionamos al usuario a la pagina de paypal.  
            */
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            // res.redirect(payment.links[i].href);
                            res.json({
                                ok: true,
                                url: payment.links[i].href
                            });
                        }
                    }
                }
            });
            
        });

    });

    // Aqui termina de ejecutar la transaccion, una vez aprobado.
    app.get('/success/:usuario/:evento/:asistencia/:precio', (req, res) => {
        let usuario = req.params.usuario;
        let evento = req.params.evento;
        let asistencia = req.params.asistencia;
        let precio = req.params.precio;

        const payerID = req.query.PayerID;
        const paymentId = req.query.paymentId;

        /*
        * Una vez paypal redirecciona a la url de Success, terminamos la transaccion.
        */
        const execute_payment_json = {
            "payer_id": payerID,
            "transactions": [{
                "amount": {
                    "currency": "MXN",
                    "total": precio
                }
            }]
        };

        /* Ejecutamos la transaccion*/
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {

                const conn = mysql();
                
                /* Insertamos a la bd los datos del usuario
                * y de la transaccion del evento*/
                conn.query(`INSERT INTO usuarios_eventos (fk_user, fk_evento, tipoAsistencia, transaccion) VALUES(?,?,?,?)`, 
                [usuario, evento, asistencia, payment.id],
                    (err, result) => {
                        if (err) {
                            conn.end(function () {});
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        let query;
                        if(asistencia === 'participante') {
                            query = 'UPDATE eventos SET numeroConcursantes = numeroConcursantes + 1 WHERE id = ?';
                        } else {

                            query = 'UPDATE eventos SET numeroAsistentes = numeroAsistentes + 1 WHERE id = ?';
                        }

                        conn.query(query, [evento], (err, result) => {
                            if (err) {
                                conn.end(function () {});
                                return res.status(500).json({
                                    ok: false,
                                    err
                                });
                            }

                            conn.end(function () {});
                            // Rederigimos a la pagina de succes donde le avisamos al usuario que todo salio bien.
                            return res.redirect(`/success:${payment.id}`);
                        });
                    });
            }
        });
    });

    app.get('/success:transaccion', (req, res) => {
        res.render('eventos/success', {
            transaccion: req.params.transaccion
        });
    });

    /*
        Validamos que el codigo que nos genera paypal al terminar la
        transaccion sea valida y se encuentre en los registros de la base de datos.
        Con esto nos aseguramos que si entran a la pagina de success como si se hubiera
        generado una transaccion no se genere ningun codigo qr.
    */
    app.post('/verificarExistencia', (req, res) => {
        const conn = mysql();

        conn.query('SELECT * FROM usuarios_eventos WHERE transaccion = ?', [req.body.transaccion], (err, result) => {
            if (err) {
                conn.end(function () {});
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(result.length > 0) {
                return res.json({
                    ok: true,
                    transaccion: req.body.transaccion
                });
            } else {
                return res.json({
                    ok: false
                });
            }
        })
    });

}