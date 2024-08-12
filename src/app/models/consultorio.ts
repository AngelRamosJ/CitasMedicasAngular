export class Consultorio{
	constructor(
		public id: number,
		public descripcion: string,
		public numero_identificacion: string,
		public estado: string,
		public fecha_creacion: string,
		public sucursal_id: number
	){}
}