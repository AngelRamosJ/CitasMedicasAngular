import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localidad } from '../models/localidad';
import { Global } from './global';

@Injectable()
export class LocalidadService{
	public url:string;

	constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
	}

	testService(){
		return 'Servicio de Angular';
	}

    getCiudadesSurcusales(): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getCiudadesSucursales', {headers: headers});
    }

    getLocalidadSucursal(ciudad: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getLocalidadSucursal/'+ciudad, {headers: headers});
    }

	saveLocalidad(localidad: Localidad): Observable<any>{
		let params = JSON.stringify(localidad);
		let headers = new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'addLocalidad', params, {headers: headers});
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