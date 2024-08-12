export class Paciente{
	constructor(
		public id: number,
		public nombre: string,
		public paterno: string,
		public materno: string,
		public curp: string,
		public correo: string,
        public telefono: string,
        public fecha_nacimiento: string,
        public sexo: string,
        public localidad_id: number
	){}
}