import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Horario } from '../models/horario';
import { Global } from './global';


@Injectable()
export class DoctorService{
	public url:string;
    public horarios: Horario[];
    private numHorariosM: number;
    private numHorariosV: number;
    private inicioM: number;
    private inicioV: number;
    constructor(
		private _http: HttpClient
	){
		this.url = Global.url;
        this.numHorariosM = 12;
        this.numHorariosV = 18;
        this.inicioM = 7;
        this.inicioV = 13;
        this.horarios = [];
        this.setHorarios(this.numHorariosM,this.inicioM,'M');
        this.setHorarios(this.numHorariosV,this.inicioV,'V');
        console.log(this.horarios);
	}

    getDoctoresSucursal(sucursal: string): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json');
		return this._http.get(this.url+'getDoctoresSucursal/'+ sucursal, {headers: headers});
	}

    public getHorarios(): Horario[] {
        return this.horarios;
    }

    private setHorarios(numHorario:number,inicioH:number,turno:string){
        let hora;
        let h = 0;
        let h_turno = '0';
        for(let i = 0; i<numHorario; i++){
            if((inicioH+h)>9){
                h_turno = '';
            }
            if(i % 2 == 0){
                hora = h_turno+(inicioH+h)+':00';
                
            }else{
                hora = h_turno+(inicioH+h)+':30';
                h++;
            }
            let horario = {
                "hora": hora,
                "turno": turno
            }
            this.horarios.push(horario);
        }
        
    }

    getTurnoHorario(hora: string): string{
        let horaInt = parseInt(hora.substring(0,2));
        if(horaInt>=13){
            return 'V';
        }else{
            return 'M';
        }
    }
}