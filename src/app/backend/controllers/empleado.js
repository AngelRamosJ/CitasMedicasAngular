var BD = require('../conexion/configORA');

var controller = {
	
    getEmpleadoLogin: async (req, res) => {
        const { login, contrasenia }  = req.params;
        sql = "SELECT * FROM empleado WHERE login = :login AND contrasenia = :contrasenia";
    
        let result = await BD.Open(sql, [login,contrasenia], false);
        //NOTA: Se manda como arreglo porque no esta validada la CURP como unica
        Empleados = [];
        result.rows.map(empleado => {
            let empleadoL = {
                "id": empleado[0],
                "nombre": empleado[1],
                "paterno": empleado[2], 
                "materno": empleado[3], 
                "rfc": empleado[4],
                "login": empleado[5],
                "contrasenia": empleado[6]
            };
            Empleados.push(empleadoL);
        })
        
    
        res.status(200).json({empleados: Empleados});
    }

}

// exportar
module.exports = controller ;