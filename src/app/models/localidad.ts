export class Localidad{
	constructor(
		public id: number,
		public pais: string,
		public estado: string,
		public codigo_postal: string,
		public ciudad: string,
		public calle: string,
        public exterior: string,
        public interior: string
	){}
}