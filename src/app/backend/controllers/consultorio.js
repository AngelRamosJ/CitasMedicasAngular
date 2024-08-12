var BD = require('../conexion/configORA');

var controller = {

	getConsultorioUbicacion: async (req, res) => {
        const { doctor_id, dia, tipo } = req.params;

        sql = "SELECT c.numero_identificacion FROM doctor d JOIN turno t ON t.doctor_id = d.id JOIN consultorio c ON c.id = t.consultorio_id JOIN sucursal s ON s.id = c.sucursal_id JOIN localidad l ON l.id = s.localidad_id WHERE d.id = :doctor_id AND t.dia = :dia AND (t.tipo = :tipo OR t.tipo = 'D')";
    
        let result = await BD.Open(sql, [doctor_id, dia, tipo], false);
        Consultorios = [];
    
        result.rows.map(consultorio => {
            let consultorioU = {
                "numero_identificacion": consultorio[0]
                /*"id": consultorio[1],
                "pais": consultorio[2],
                "estado": consultorio[3], 
                "codigo_postal": consultorio[4], 
                "ciudad": consultorio[5],
                "calle": consultorio[6],
                "exterior": consultorio[7],
                "interior": consultorio[8]*/
            };
            Consultorios.push(consultorioU);
        })
    
        res.status(200).json({consultorios: Consultorios});
        
    }

}

// exportar
module.exports = controller ;