import { Component, OnInit, DoCheck } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Cita } from 'src/app/models/cita';
import { Localidad } from 'src/app/models/localidad';
import { Sucursal } from 'src/app/models/sucursal';
import { CitaService } from 'src/app/services/cita.service';
import { LocalidadService } from 'src/app/services/localidad.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { ConsultorioService } from 'src/app/services/consultorio.service';
import { Doctor } from 'src/app/models/doctor';
import { Horario } from 'src/app/models/horario';
import { Paciente } from 'src/app/models/paciente';
import { Consultorio } from 'src/app/models/consultorio';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css'],
  providers: [CitaService,LocalidadService,DoctorService,PacienteService,ConsultorioService,DatePipe]
})
export class CitaComponent implements OnInit, DoCheck {
  //PAGO PAYPAL
  public payPalConfig?: IPayPalConfig;
  private showSuccess: boolean;
  //Datos para Cita
  public cita: Cita;
  public citas: Cita[];
  public nombres: any[];
  //Datos para Paciente
  public paciente: Paciente;
  //Datos para Localidad
  public ciudades: Localidad[];
  public localidades: Localidad[];
  public localidad: Localidad;
  //Datos para Sucursal
  public sucursales: Sucursal[];
  //Datos para Doctor
  public doctores: Doctor[];
  public horarios: Horario[];
  //Datos para Consultorio
  public consultorio: Consultorio;

  //Banderas y Variables de Control
  public ciudadElegida: string;
  public sucursalElegida: string;
  public fechaElegida: any;
  public doctorElegido: number;
  public horaElegida: string;
  public num_sucursal: number;
  public eleccionVerificacion: string;
  public curpPaciente: string;
  public controlDisplayPaypal: boolean;

  constructor(
    private _citaService: CitaService,
    private _localidadService: LocalidadService,
    private _doctorService: DoctorService,
    private _pacienteService: PacienteService,
    private _consultorioService: ConsultorioService,
    private datepipe: DatePipe
    ) { 
      this.cita = new Cita(0,0,'','','','');
      this.localidad = new Localidad(-1,'','','','','','','');
      this.consultorio = new Consultorio(-1,'','','','',-1);
      let fecha = new Date();
      this.fechaElegida = this.datepipe.transform(fecha, 'yyyy-MM-dd');
      this.paciente = new Paciente(-1,'','','','','','',this.fechaElegida,'',-1);
      this.citas = [];
      this.nombres = [];
      this.ciudades = [];
      this.sucursales = [];
      this.localidades = [];
      this.doctores = [];
      this.horarios = [];
      this.ciudadElegida = "";
      this.sucursalElegida = "";
      this.doctorElegido = -1;
      this.horaElegida = ""
      this.num_sucursal = -1;
      this.eleccionVerificacion = "";
      this.curpPaciente = "";
      this.showSuccess = false;
      this.controlDisplayPaypal = true;
    } 

  ngOnInit(): void {
    this.initConfig();
    $('.form-cita').hide();
    $('.form-localidad').hide();
    $('#formularios-citas').hide();
    $('#pago-paypal').addClass('d-none');
    $('#div-pago-paypal').hide();
    $('#confirmacion-cita').hide();
    $('#busqueda-curp-paciente').hide();
    $('#verificacion-citas').hide();
    $('#verificacion-citas').fadeIn(1000);
    this.getCiudadesSucursales();
    this.horarios = this._doctorService.getHorarios();
    for(let i=0;i<10;i++){
      console.log(this.generaNumeroCita('2022-06-13'));
    }
  }

  ngDoCheck(){
    if(this.ciudadElegida != ''){
      this.getLocalidadSucursal();
      this.ciudadElegida = '';
    }
    if(this.sucursalElegida != ''){
      this.getDoctorSucursal();
      this.num_sucursal = parseInt(this.sucursalElegida);
      this.sucursalElegida = '';
    }
    
  }


  //Pasar del Formulario de Paciente al Formulario de Localidad
  onSubmitPaciente(){
    $('.form-paciente').hide(500);
    $('.form-localidad').show(1500); 
    $('#fondo_formularios_citas').removeClass("fondo_formulario_paciente");
    $('#fondo_formularios_citas').addClass("fondo_formulario_localidad");
    console.log(this.paciente);
  }

  //Pasar del Formulario de Localidad al Formulario de Cita
  onSubmitLocalidad(){
    $('.form-localidad').hide(500);
    $('.form-cita').show(1500); 
    $('#fondo_formularios_citas').removeClass("fondo_formulario_localidad");
    $('#fondo_formularios_citas').addClass("fondo_formulario_cita");
    console.log(this.localidad);
  }


  //Realizar la generacion de la Cita
  onSubmitCita(){
    this.cita.doctor_id = this.doctorElegido;
    this.cita.fecha_encuentro = this.fechaElegida;
    this.cita.hora_encuentro = this.horaElegida;
    this.cita.clave_identificacion = this.generaNumeroCita(this.fechaElegida);
    this.cita.estado = 'A';
    if(this.curpPaciente == ''){
      this.addLocalidadPacienteCita();
    }else{
      this.cita.paciente_id = this.paciente.id;
      this.addCita();

    }
  }

  showHidePagoPayPal(){
    if(this.controlDisplayPaypal){
      $('#pago-paypal').removeClass('d-none');
    }else{
      setTimeout(function(){
        $('#pago-paypal').addClass('d-none');
      },300);
      
    }
    this.controlDisplayPaypal = !this.controlDisplayPaypal;
    $('#div-pago-paypal').slideToggle();
  }

  showConfirmacion(){
    $('#formularios-citas').hide(500);
    $('#confirmacion-cita').show(1500);
  }

  showFormulariosPacienteNuevo(){
    $('#verificacion-citas').hide(500);
    $('#formularios-citas').show(1500);
  }

  showBusquedaCURP(){
    $('#verificacion-citas').hide(500)
    $('#busqueda-curp-paciente').show(1500);
  }

  showFormularioCita(){
    $('#busqueda-curp-paciente').hide(500);
    $('.form-paciente').hide();
    $('#fondo_formularios_citas').removeClass("fondo_formulario_paciente");
    $('#fondo_formularios_citas').addClass("fondo_formulario_cita");
    $('.form-cita').show();
    $('#formularios-citas').show(1500);
  }

  

  verificarVentana(){
    if(this.eleccionVerificacion == 'S'){
      this.showBusquedaCURP();
    }else{
      if(this.eleccionVerificacion == 'N'){
        this.showFormulariosPacienteNuevo();
      }
    }
    
  }
  //Busca un Paciente dado su CURP
  buscarCURP(){
    this._pacienteService.getPacienteCURP(this.curpPaciente).subscribe(
      response => {
        if(response.pacientes.length != 0){
          this.paciente = response.pacientes[0];
          this.showFormularioCita();
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Agregar la Cita Generada
  addCita(){
    this._citaService.saveCita(this.cita).subscribe(
      response => {
        if(response.cita.doctor_id != ""){
          //LLAMAR O MOSTRAR A CONFIRMACION DE CITA
          this.getConsultorioUbicacion();
          this.showConfirmacion();
        }else{
          console.log("Fallo Cita");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Agregar los datos de la Localidad, el Paciente y la Cita generada
  addLocalidadPacienteCita(){
    this._localidadService.saveLocalidad(this.localidad).subscribe(
      response => {
        if(response.localidades.length != 0){
          this.paciente.localidad_id = response.localidades[0].id;
          this._pacienteService.savePaciente(this.paciente).subscribe(
            response => {
              if(response.pacientes.length != 0){
                this.cita.paciente_id = response.pacientes[0].id;
                this._citaService.saveCita(this.cita).subscribe(
                  response => {
                    if(response.cita.doctor_id != ""){
                      //LLAMAR O MOSTRAR A CONFIRMACION DE CITA
                      this.getConsultorioUbicacion();
                      this.showConfirmacion();
                    }else{
                      console.log("Fallo Cita");
                    }
                  },
                  error => {
                    console.log(<any>error);
                  }
                );
              }else{
                console.log("Fallo Paciente");
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        }else{
          console.log("Fallo Localidad");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Consigue el numero de Consultorio y Ubicacion de este (la Ubicacion es dada por la Sucursal)
  getConsultorioUbicacion(){
    let dia = new Date(this.fechaElegida).getDay()+1;
    let turno = this._doctorService.getTurnoHorario(this.horaElegida);
    this._consultorioService.getConsultorioUbicacion(this.doctorElegido,dia,turno).subscribe(
      response => {
        if(response.consultorios.length != 0){
          this.consultorio = response.consultorios[0];
          this.localidad = response.consultorios[0];
          console.log(response.consultorios);
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }


  //Consigue los Doctores de una Sucursal
  getDoctorSucursal(){
    this._doctorService.getDoctoresSucursal(this.sucursalElegida).subscribe(
      response => {
        if(response.doctores[0].id != ""){
          this.doctores = response.doctores;
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Consigue las Sucursales de la Ciudad dada
  getLocalidadSucursal(){
    let sucursales = this.sucursales;
    this._localidadService.getLocalidadSucursal(this.ciudadElegida).subscribe(
      response => {
        if(response.localidadSucursal[0].sucursal != ""){
          this.localidades = response.localidadSucursal;
          
          response.localidadSucursal.forEach(function(elem: { id_sucursal: any; nombre: any; }){
            let sucursal = {
              "id": elem.id_sucursal,
              "nombre": elem.nombre,
              "telefono": "",
              "localidad_id": -1
            }
            sucursales.push(sucursal);
          });
          
        }else{
          console.log("Fallo");

        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  //Consigue las Ciudades de las Sucursales
  
  getCiudadesSucursales(){
    this._localidadService.getCiudadesSurcusales().subscribe(
      response => {
        if(response.localidad[0].ciudad != ""){
          this.ciudades = response.localidad;
          
        }else{
          console.log("Fallo");

        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
  

  //Genera el Numero de Indentificacion al Azar de la Cita
  private generaNumeroCita(fecha:string): string{
    let inicio = "CIT-";
    let fechaD = new Date(fecha);
    inicio = inicio + fechaD.getFullYear() + (fechaD.getMonth()+1) + (fechaD.getDay()+1) + this.getRandomCita();
    return inicio;

  }

  //Genera un Numero Random de 4 digitos Ej: 0004, 0010, 0541, 9999
  private getRandomCita(): string{
    let random = Math.floor(Math.random()*10000);
    let citaRandom = '';
    let numDigitos = random.toString().length
    switch(numDigitos){
      case 1:
        citaRandom = '000'+random;
        break;
      case 2:
        citaRandom = '00'+random;
        break;
      case 3:
        citaRandom = '0'+random;
        break;
      default: 
        citaRandom = random.toString();
      }
      return citaRandom;
    }



}
