
'use strict'

const proyecto = require('../models/proyecto');
var fs = require('fs');
var path = require('path');

var controller = {
	
	home: function(req, res){
		return res.status(200).send({
			message: 'Página home'
		});
	},

	test: function(req, res){
		return res.status(200).send({
			message: "Método Test Controlador Proyecto"
		});
	},

	saveProyecto: function(req, res){
		var project = new proyecto();

		var params = req.body;
        project.nombre = params.nombre;
        project.semestre = params.semestre;
        project.materia = params.materia;
        project.anio = params.anio;
        project.imagen = params.imagen;


		console.log(project.nombre);
		console.log(project.semestre);
		console.log(project.materia);
		console.log(project.anio);
		console.log(project.imagen);

        project.save((err, projectStored) => {
            if(err) return res.status(500).send({message: 'Error al guardar el documento.'});



            if(!projectStored) return res.status(404).send({message: 'No se ha podido guardar el proyecto.'});



            return res.status(200).send({project: projectStored});
        });
		
    },
	uploadImage: function(req, res){ 
		var projectId = req.params.id; 
		var fileName = 'Imagen no subida...'; 


		
		if(req.files){ 
			var filePath = req.files.imagen.path; 
			var fileSplit = filePath.split('\\'); 
			var fileName = fileSplit[1]; 
			var extSplit = fileName.split('.'); 
			var fileExt = extSplit[1]; 
			if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){ 
				proyecto.findByIdAndUpdate(projectId, {imagen: fileName}, {new: true}, (err, projectUpdated) => { 
					if(err)
						return res.status(500).send({message: 'La imagen no se ha subido'}); 
					if(!projectUpdated) 
						return res.status(404).send({message: 'El proyecto no existe y no se ha asignado la imagen'}); 
					console.log(projectUpdated);
					return res.status(200).send({ project: projectUpdated }); 
				}); 
			}else{ 
				fs.unlink(filePath, (err) => { 
					return res.status(200).send({message: 'La extensión no es válida'}); 
				}); 
			} 
		}else{ 
			return res.status(200).send({ message: fileName }); 
		}
	}, 
	getImageFile: function(req, res){ 
		var file = req.params.image; 
		var path_file = './uploads/'+file; 
		fs.exists(path_file, (exists) => { 
			if(exists){ 
				return res.sendFile(path.resolve(path_file)); 
			}else{ 
				return res.status(200).send({ message: "No existe la imagen..." }); 
			} 
		}); 
	}
}


// exportar
module.exports = controller ;