var BD = require('../conexion/configORA');

var controller = {
	addPaciente: async (req, res) => {
        const { nombre, paterno, materno, curp, correo, telefono, fecha_nacimiento, sexo, localidad_id } = req.body;
        sql = "insert into paciente(id,nombre, paterno,materno,curp,correo,telefono,fecha_nacimiento,sexo,localidad_id) values (auto_increment_paciente.nextval,:nombre,:paterno,:materno,:curp,:correo,:telefono,TO_DATE(:fecha_nacimiento,'YYYY-MM-DD'),:sexo,:localidad_id)";
    
        await BD.Open(sql, [nombre, paterno, materno, curp, correo, telefono, fecha_nacimiento, sexo, localidad_id], true);
        //NOTA: Se envia un arreglo Pacientes porque no esta validado que la CURP sea unica
        sql = "SELECT id FROM paciente WHERE curp = :curp"
        let result = await BD.Open(sql, [curp], false);

        Pacientes = [];
    
        result.rows.map(paciente => {
            let pacienteC = {
                "id": paciente[0],
                "nombre": nombre,
                "paterno": paterno, 
                "materno": materno, 
                "curp": curp,
                "correo": correo,
                "telefono": telefono,
                "fecha_nacimiento": fecha_nacimiento,
                "sexo": sexo,
                "localidad_id": localidad_id
            };
            Pacientes.push(pacienteC);
        })
    
        res.status(200).json({pacientes: Pacientes});
        /*const { nombre, paterno, materno, curp, correo, telefono, fecha_nacimiento, sexo, localidad_id } = req.body;
        Pacientes = [];
        let pacienteC = {
            "id": 11,
            "nombre": nombre,
            "paterno": paterno, 
            "materno": materno, 
            "curp": curp,
            "correo": correo,
            "telefono": telefono,
            "fecha_nacimiento": fecha_nacimiento,
            "sexo": sexo,
            "localidad_id": localidad_id
        };
        Pacientes.push(pacienteC);
        console.log(req.body);
        res.status(200).json({pacientes: Pacientes});*/
    },
    getPacienteCURP: async (req, res) => {
        const { curp }  = req.params;
        sql = "SELECT * FROM paciente WHERE curp = :curp";
    
        let result = await BD.Open(sql, [curp], false);
        //NOTA: Se manda como arreglo porque no esta validada la CURP como unica
        Pacientes = [];
        result.rows.map(paciente => {
            let pacienteC = {
                "id": paciente[0],
                "nombre": paciente[1],
                "paterno": paciente[2], 
                "materno": paciente[3], 
                "curp": paciente[4],
                "correo": paciente[5],
                "telefono": paciente[6],
                "fecha_nacimiento": paciente[7],
                "sexo": paciente[8],
                "localidad_id": paciente[9]
            };
            Pacientes.push(pacienteC);
        })
        
    
        res.status(200).json({pacientes: Pacientes});
    }

}

// exportar
module.exports = controller ;