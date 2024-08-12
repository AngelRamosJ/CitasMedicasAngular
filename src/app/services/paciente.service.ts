import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Paciente } from '../models/paciente';

@Injectable()
export class PacienteService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	testService(){
		return 'Servicio de Angular';
	}


	savePaciente(paciente: Paciente): Observable<any>{
		let params = JSON.stringify(paciente);
		let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'addPaciente', params, {headers: headers});
	}

	getPacienteCURP(curp: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getPacienteCURP/' + curp, {headers: headers});
	}

/*
    getCitas(): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
        console.log(headers);
		return this._http.get(this.url+'getCitas', {headers: headers});
	}

	saveCita(cita: Cita): Observable<any>{
		let params = JSON.stringify(cita);
		let headers = new HttpHeaders().set('Content-Type','application/json');
		
		return this._http.post(this.url+'addCita', params, {headers: headers});
	}

    deleteCitas(clave_identificacion: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		return this._http.delete(this.url+'deleteCita/'+clave_identificacion, {headers: headers});
	}
    */
}