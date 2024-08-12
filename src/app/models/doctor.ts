export class Doctor{
	constructor(
		public id: number,
		public nombre: string,
		public paterno: string,
		public materno: string,
		public cedula: string,
		public profesion: string,
        public especialidad: string,
        public telefono: string,
        public salario: number,
        public localidad_id: number
	){}
}