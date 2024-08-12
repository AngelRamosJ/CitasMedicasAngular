
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProyectoSchema = Schema({
	nombre: String,
	semestre: String,
	materia: String, 
	anio:  Number, 
	imagen:  String
});



module.exports = mongoose.model('Proyecto', ProyectoSchema);