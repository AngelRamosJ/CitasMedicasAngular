import { Component, OnInit, DoCheck } from '@angular/core';
import { Paciente } from 'src/app/models/paciente';
import { Cita } from 'src/app/models/cita';
import { Doctor } from 'src/app/models/doctor';
import { Localidad } from 'src/app/models/localidad';
import { Consultorio } from 'src/app/models/consultorio';
import { Sucursal } from 'src/app/models/sucursal';
import { CitaService } from 'src/app/services/cita.service';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
  providers: [PacienteService,CitaService]
})
export class PacienteComponent implements OnInit, DoCheck {
  //Datos del Paciente
  public paciente: Paciente;
  //Datos de Cita
  public citas: Cita[];
  public cita: Cita;
  public claves: string[];
  //Datos de Doctor
  public doctores: Doctor[];
  //Datos de Localidad
  public localidades: Localidad[];
  //Datos de Consultorio
  public consultorios: Consultorio[];
  //Datos de Sucursal
  public sucursales: Sucursal[];
  //Variables de Control
  public curpPaciente: string;
  public claveCita: string;
  public indiceCitaEliminar: number;
  public confirmacionEliminarCita: string;
  constructor(
    private _pacienteService: PacienteService,
    private _citaService: CitaService
  ) { 
    this.paciente = new Paciente(-1,'','','','','','','','',-1);
    this.cita = new Cita(-1,-1,'','','','');
    this.citas = [];
    this.claves = [];
    this.doctores = [];
    this.localidades = [];
    this.consultorios = [];
    this.sucursales = [];
    this.curpPaciente = "";
    this.claveCita = "";
    this.indiceCitaEliminar = -1;
    this.confirmacionEliminarCita = "";
  }

  ngOnInit(): void {
    $('#citas-paciente').hide();
    $('#busqueda-curp-citas').hide();
    $('#busqueda-curp-citas').fadeIn(1500);
  }
  
  ngDoCheck(){

    if(this.confirmacionEliminarCita != ''){

      this._citaService.updateCitaEstado(this.citas[this.indiceCitaEliminar].clave_identificacion,'C').subscribe(
        response => {
          this.citas[this.indiceCitaEliminar].estado = 'C';
          this.indiceCitaEliminar = -1;
        },
        error => {
          console.log(<any>error);
        }
      );
      
      this.confirmacionEliminarCita = '';
    }
    
  }

  setConfirmacionEliminarCita(confirmacion:string){
    this.confirmacionEliminarCita = confirmacion;
  }

  //Guardar el indice del elemento que se quiere eliminar
  guardarIndiceEliminarCita(indice:number){
    this.indiceCitaEliminar = indice;
  }

  //Muesta la informacion de la Cita al introducir la clave
  agregaClaveCita(clave_identificacion:string,indice:number){
    if(!this.claves.includes(clave_identificacion)){
      if(this.citas[indice].clave_identificacion == clave_identificacion){
        $('.datos-citas-'+indice).hide();
        this.claves[indice]=clave_identificacion;
        this.showHideCompruebaClaveCita(indice);
        this.cambiaBotonMostrar(indice);
        $('#boton-eliminar-'+indice).removeClass('disabled');
        $('.datos-citas-'+indice).fadeIn(2000);
        
      
        this.claveCita = '';
      }
    }
  }

  cambiaBotonMostrar(indice:number){
    let selector = '#boton-mostrar-'+indice;
    $(selector).addClass('disabled');
    $(selector + ' .bi-eye-slash-fill').fadeOut(500);
    setTimeout(function(){
      $(selector + ' .bi-eye-fill').fadeIn(1000);
    },500);
      
  }

  showHideCompruebaClaveCita(indice:number){
    let selector = '#comprueba-clave-cita-'+indice;
    $(selector).slideToggle();
  }

  //Mostrar todas las citas si existe el CURP, pero sin la informacion por Seguridad (Hasta que introduzcan la clave de la cita)
  showCitas(){
    $('#busqueda-curp-citas').hide(1000);
    $('#citas-paciente').fadeIn(1800);
    setTimeout(function(){
      $('.comprobador-clave-cita').hide();
      $('.bi-eye-fill').hide();
    },300);
  }

  //Borra la Cita dada la clave de identificación, la cual es única por cita
  deleteCita(){
    this._citaService.deleteCitas(this.cita.clave_identificacion).subscribe(
      response => {
        
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  //Consigue todas las citas de un paciente dado
  getCitas(){
    let localidades = this.localidades;
    let sucursales = this.sucursales;
    this._citaService.getCitas(this.paciente.id).subscribe(
      response => {
        if(response.citas.length != 0){
          this.citas = response.citas;
          this.consultorios = response.citas;
          this.doctores = response.citas;
          response.citas.forEach(function(elem: {
            nombre_sucursal: any; id: any; pais: any; estado_localidad: any; codigo_postal: any; ciudad: any; calle: any; exterior: any; interior: any; 
          }){
            let localidad = {
              "id": elem.id,
              "pais": elem.pais,
              "estado": elem.estado_localidad,
              "codigo_postal": elem.codigo_postal,
              "ciudad": elem.ciudad,
              "calle": elem.calle,
              "exterior": elem.exterior,
              "interior": elem.interior
            }
            let sucursal = {
              "id": -1,
              "nombre": elem.nombre_sucursal,
              "telefono": "",
              "localidad_id": -1
            }
            localidades.push(localidad);
            sucursales.push(sucursal);
          });
          console.log(response.citas);
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Busca un Paciente dado su CURP
  buscarCURP(){
    this._pacienteService.getPacienteCURP(this.curpPaciente).subscribe(
      response => {
        if(response.pacientes.length != 0){
          this.paciente = response.pacientes[0];
          this.getCitas();
          this.showCitas();
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  

}
