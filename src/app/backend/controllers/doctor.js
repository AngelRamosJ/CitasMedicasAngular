const doctorM = require('../models/doctor');
var fs = require('fs');
var path = require('path');
var BD = require('../conexion/configORA');

var controller = {
	
	getDoctoresSucursal: async (req, res) => {
        const sucursal = req.params.sucursal
        sql = "SELECT d.id, d.nombre, d.paterno, d.materno, s.nombre FROM doctor d JOIN turno t ON t.doctor_id = d.id JOIN consultorio c ON t.consultorio_id = c.id JOIN sucursal s ON c.sucursal_id = s.id WHERE s.id = :sucursal GROUP BY d.id,d.nombre,d.paterno,d.materno,s.nombre";
    
        let result = await BD.Open(sql, [sucursal], false);
        Doctores = [];
    
        result.rows.map(doctor => {
            let doctorS = {
                "id": doctor[0],
                "nombre": doctor[1],
                "paterno": doctor[2], 
                "materno": doctor[3], 
                "cedula":  "",
                "profesion": "",
                "especialidad": "",
                "telefono": "",
                "salario": "",
                "localidad_id": "",
                "sucursal": doctor[4]
            };
            Doctores.push(doctorS);
        })
    
        res.status(200).json({doctores: Doctores});
    }
}

// exportar
module.exports = controller ;