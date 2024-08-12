const localidadM = require('../models/localidad');
var fs = require('fs');
var path = require('path');
var BD = require('../conexion/configORA');

var controller = {
	addLocalidad: async (req, res) => {
        const { pais, estado, codigo_postal, ciudad, calle, exterior, interior } = req.body;
        sql = "insert into localidad(id,pais,estado,codigo_postal,ciudad,calle,exterior,interior) values (auto_increment_localidad.nextval,:pais,:estado,:codigo_postal,:ciudad,:calle,:exterior,:interior)";
    
        await BD.Open(sql, [pais, estado, codigo_postal, ciudad, calle, exterior, interior], true);
        
        sql = "SELECT id FROM localidad WHERE pais = :pais AND estado = :estado AND codigo_postal = :codigo_postal AND ciudad = :ciudad AND calle = :calle AND exterior = :exterior AND interior = :interior"
        let result = await BD.Open(sql, [pais, estado, codigo_postal, ciudad, calle, exterior, interior], false);

        Localidades = [];
    
        result.rows.map(localidad => {
            let localidadC = {
                "id": localidad[0],
                "pais": pais,
                "estado": estado, 
                "codigo_postal": codigo_postal, 
                "ciudad": ciudad,
                "calle": calle,
                "exterior": exterior,
                "interior": interior
            };
            Localidades.push(localidadC);
        })
    
        res.status(200).json({localidades: Localidades});
        /*const { pais, estado, codigo_postal, ciudad, calle, exterior, interior } = req.body;
        Localidades = [];
        let localidadC = {
            "id": 10,
            "pais": pais,
            "estado": estado, 
            "codigo_postal": codigo_postal, 
            "ciudad": ciudad,
            "calle": calle,
            "exterior": exterior,
            "interior": interior
        };
        Localidades.push(localidadC);
        console.log(req.body);
        res.status(200).json({localidades: Localidades});*/
    },

	getCiudadesSucursales: async (req, res) => {
        
        sql = "SELECT l.ciudad FROM localidad l JOIN sucursal s ON s.localidad_id = l.id GROUP BY l.ciudad";
    
        let result = await BD.Open(sql, [], false);
        Ciudades = [];
    
        result.rows.map(ciudad => {
            let localidadS = {
                "id": "",
                "pais": "",
                "estado": "", 
                "codigo_postal": "", 
                "ciudad": ciudad[0],
                "calle": "",
                "exterior": "",
                "interior": ""
            };
            Ciudades.push(localidadS);
        })
    
        res.status(200).json({localidad: Ciudades});
    },
    getLocalidadSucursal: async (req, res) => {
        const ciudad  = req.params.ciudad;
        sql = "SELECT s.nombre, s.id, l.* FROM localidad l JOIN sucursal s ON s.localidad_id = l.id WHERE l.ciudad = :ciudad";
    
        let result = await BD.Open(sql, [ciudad], false);
        Sucursales = [];
        result.rows.map(ciudad => {
            let localidadS = {
                "id": ciudad[2],
                "pais": ciudad[3],
                "estado": ciudad[4], 
                "codigo_postal": ciudad[5], 
                "ciudad": ciudad[6],
                "calle": ciudad[7],
                "exterior": ciudad[8],
                "interior": ciudad[9],
                "nombre": ciudad[0],
                "id_sucursal": ciudad[1]
            };
            Sucursales.push(localidadS);
        })
        
    
        res.status(200).json({localidadSucursal: Sucursales});
    }

}

// exportar
module.exports = controller ;