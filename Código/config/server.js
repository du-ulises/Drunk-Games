const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload'); 

const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views/pages'));


process.env.CADUCIDAD_TOKEN = "8h";
process.env.SEED = process.env.SEED || 'seed-desarrollo';

process.env.SQLDB = process.env.SQLDB || 'drunk';
process.env.SQLHOST = process.env.SQLHOST || 'localhost';
process.env.SQLUSER = process.env.SQLUSER || 'root';
process.env.SQLPASS = process.env.SQLPASS || '';

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;