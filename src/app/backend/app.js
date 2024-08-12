'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar archivos rutas
var proyecto_routes = require('./routes/rutas');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Configurar cabeceras y cors
// CORS y cabeceras
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



//rutas

app.use('/api', proyecto_routes);

//exportar
module.exports = app;