import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from '../models/cita'; 
import { Global } from './global';

@Injectable()
export class CitaService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	testService(){
		return 'Servicio de Angular';
	}

    getCitas(paciente: number): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getCitas/' + paciente, {headers: headers});
	}

	getCitasFecha(mes: string, anio: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getCitasFecha/'+ mes + '&' + anio, {headers: headers});
	}

	saveCita(cita: Cita): Observable<any>{
		let params = JSON.stringify(cita);
		let headers = new HttpHeaders().set('Content-Type','application/json');
		
		return this._http.post(this.url+'addCita', params, {headers: headers});
	}

	updateCitaEstado(clave_identificacion:string,estado:string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'updateCitaEstado/'+clave_identificacion+'&'+estado, {headers: headers});
	}

    deleteCitas(clave_identificacion: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.delete(this.url+'deleteCita/'+clave_identificacion, {headers: headers});
	}
}