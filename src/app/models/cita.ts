export class Cita{
	constructor(
		public doctor_id: number,
		public paciente_id: number,
		public fecha_encuentro: string,
		public hora_encuentro: string,
		public clave_identificacion: string,
		public estado: string
	){}
}