import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Consultorio } from '../models/consultorio'; 

@Injectable()
export class ConsultorioService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	testService(){
		return 'Servicio de Angular';
	}

    getConsultorioUbicacion(doctor_id: number, dia: number, tipo: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getConsultorioUbicacion/' + doctor_id + '&' + dia + '&' + tipo, {headers: headers});
	}
	

/*
    

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