const citaM = require('../models/cita');
var fs = require('fs');
var path = require('path');
var BD = require('../conexion/configORA');

var controller = {
	
	getCitas: async (req, res) => {
        const { paciente } = req.params; 
        sql = "SELECT ci.doctor_id,ci.paciente_id,ci.fecha_encuentro,ci.hora_encuentro,ci.clave_identificacion,ci.estado,l.id,l.pais,l.estado,l.codigo_postal,l.ciudad,l.calle,l.exterior,l.interior,co.numero_identificacion,s.nombre,d.nombre,d.paterno,d.materno FROM cita ci JOIN doctor d ON ci.doctor_id = d.id JOIN turno t ON t.doctor_id = d.id JOIN consultorio co ON co.id = t.consultorio_id JOIN sucursal s ON s.id = co.sucursal_id JOIN localidad l ON l.id = s.localidad_id WHERE ci.paciente_id = :paciente GROUP BY ci.doctor_id,ci.paciente_id,ci.fecha_encuentro,ci.hora_encuentro,ci.clave_identificacion,ci.estado,l.id,l.pais,l.estado,l.codigo_postal,l.ciudad,l.calle,l.exterior,l.interior,co.numero_identificacion,s.nombre,d.nombre,d.paterno,d.materno";
    
        let result = await BD.Open(sql, [paciente], false);
        Citas = [];
    
        result.rows.map(cita => {
            let citaP = {
                "doctor_id": cita[0],
                "paciente_id": cita[1],
                "fecha_encuentro": cita[2], 
                "hora_encuentro": cita[3], 
                "clave_identificacion": cita[4],
                "estado": cita[5],
                "id": cita[6],
                "pais": cita[7],
                "estado_localidad": cita[8],
                "codigo_postal": cita[9],
                "ciudad": cita[10],
                "calle": cita[11],
                "exterior": cita[12],
                "interior": cita[13],
                "numero_identificacion": cita[14],
                "nombre_sucursal": cita[15],
                "nombre": cita[16],
                "paterno": cita[17],
                "materno": cita[18]
            };
            Citas.push(citaP);
        })
    
        res.status(200).json({citas: Citas});
    },
    getCitasFecha: async (req, res) => {
        const { mes, anio } = req.params; 
        sql = "SELECT ci.doctor_id,ci.paciente_id,ci.fecha_encuentro,ci.hora_encuentro,ci.clave_identificacion,ci.estado,l.id,l.pais,l.estado,l.codigo_postal,l.ciudad,l.calle,l.exterior,l.interior,co.numero_identificacion,s.nombre,d.nombre,d.paterno,d.materno,p.nombre,p.paterno,p.materno FROM cita ci JOIN paciente p ON ci.paciente_id = p.id JOIN doctor d ON ci.doctor_id = d.id JOIN turno t ON t.doctor_id = d.id JOIN consultorio co ON co.id = t.consultorio_id JOIN sucursal s ON s.id = co.sucursal_id JOIN localidad l ON l.id = s.localidad_id WHERE EXTRACT(MONTH FROM ci.fecha_encuentro) = :mes AND EXTRACT(YEAR FROM ci.fecha_encuentro) = :anio GROUP BY ci.doctor_id,ci.paciente_id,ci.fecha_encuentro,ci.hora_encuentro,ci.clave_identificacion,ci.estado,l.id,l.pais,l.estado,l.codigo_postal,l.ciudad,l.calle,l.exterior,l.interior,co.numero_identificacion,s.nombre,d.nombre,d.paterno,d.materno,p.nombre,p.paterno,p.materno";
    
        let result = await BD.Open(sql, [mes,anio], false);
        Citas = [];
    
        result.rows.map(cita => {
            let citaP = {
                "doctor_id": cita[0],
                "paciente_id": cita[1],
                "fecha_encuentro": cita[2], 
                "hora_encuentro": cita[3], 
                "clave_identificacion": cita[4],
                "estado": cita[5],
                "id": cita[6],
                "pais": cita[7],
                "estado_localidad": cita[8],
                "codigo_postal": cita[9],
                "ciudad": cita[10],
                "calle": cita[11],
                "exterior": cita[12],
                "interior": cita[13],
                "numero_identificacion": cita[14],
                "nombre_sucursal": cita[15],
                "nombre": cita[16],
                "paterno": cita[17],
                "materno": cita[18],
                "nombre_paciente": cita[19],
                "paterno_paciente": cita[20],
                "materno_paciente": cita[21]
            };
            Citas.push(citaP);
        })
    
        res.status(200).json({citas: Citas});
    },
    addCita: async (req, res) => {
        const { doctor_id, paciente_id, fecha_encuentro, hora_encuentro, clave_identificacion, estado } = req.body;
        sql = "insert into cita(doctor_id,paciente_id,fecha_encuentro,hora_encuentro,clave_identificacion,estado) values (:doctor_id, :paciente_id, TO_DATE(:fecha_encuentro,'YYYY-MM-DD'), :hora_encuentro, :clave_identificacion, :estado)";
    
        await BD.Open(sql, [doctor_id, paciente_id, fecha_encuentro, hora_encuentro, clave_identificacion, estado], true);
        
        let cita = {
            "doctor_id": doctor_id,
            "paciente_id": paciente_id,
            "fecha_encuentro": fecha_encuentro, 
            "hora_encuentro": hora_encuentro, 
            "clave_identificacion":  clave_identificacion,
            "estado": estado
        };
        res.status(200).json({cita: cita});
        /*const { doctor_id, paciente_id, fecha_encuentro, hora_encuentro, clave_identificacion, estado } = req.body;
        console.log(req.body);
        let cita = {
            "doctor_id": doctor_id,
            "paciente_id": paciente_id,
            "fecha_encuentro": fecha_encuentro, 
            "hora_encuentro": hora_encuentro, 
            "clave_identificacion":  clave_identificacion,
            "estado": estado
        };
        res.status(200).json({cita: cita});*/
    },

    deleteCita: async (req, res) => {
        const { clave_identificacion } = req.body;
    
        sql = "delete from cita where clave_identificacion=:clave_identificacion";
    
        await BD.Open(sql, [clave_identificacion], true);

        res.status(200).json({ msg: "Cita Eliminada" });
    },

    updateCitaEstado: async (req, res) => {
        const { clave_identificacion, estado } = req.params;
        sql = "UPDATE cita SET estado = :estado WHERE clave_identificacion = :clave_identificacion";
        await BD.Open(sql, [estado, clave_identificacion], true);
        res.status(200).json({ msg: "Cita Actualizada" });
    }
}

// exportar
module.exports = controller ;