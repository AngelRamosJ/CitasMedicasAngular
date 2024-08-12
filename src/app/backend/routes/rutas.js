'use strict'

var express = require('express');
var CitaController = require('../controllers/cita');
var LocalidadController = require('../controllers/localidad');
var DoctorController = require('../controllers/doctor');
var PacienteController = require('../controllers/paciente');
var ConsultorioController = require('../controllers/consultorio');
var EmpleadoController = require('../controllers/empleado');
var router = express.Router();
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart({ uploadDir: './uploads' });

//CITAS
router.get('/getCitas/:paciente',CitaController.getCitas);
router.post('/addCita',CitaController.addCita);
router.delete('/deleteCita/:clave_identificacion',CitaController.deleteCita);
router.get('/updateCitaEstado/:clave_identificacion&:estado',CitaController.updateCitaEstado);
router.get('/getCitasFecha/:mes&:anio',CitaController.getCitasFecha);

//LOCALIDADES
router.get('/getCiudadesSucursales',LocalidadController.getCiudadesSucursales);
router.get('/getLocalidadSucursal/:ciudad',LocalidadController.getLocalidadSucursal);
router.post('/addLocalidad',LocalidadController.addLocalidad);

//DOCTORES
router.get('/getDoctoresSucursal/:sucursal',DoctorController.getDoctoresSucursal);

//PACIENTES
router.post('/addPaciente',PacienteController.addPaciente);
router.get('/getPacienteCURP/:curp',PacienteController.getPacienteCURP);

//CONSULTORIOS
router.get('/getConsultorioUbicacion/:doctor_id&:dia&:tipo',ConsultorioController.getConsultorioUbicacion);

//EMPLEADOS
router.get('/getEmpleadoLogin/:login&:contrasenia',EmpleadoController.getEmpleadoLogin);

module.exports = router;