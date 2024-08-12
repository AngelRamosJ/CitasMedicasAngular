import { Component, OnInit, DoCheck } from '@angular/core';
const {createCanvas, loadImage} = require('canvas');
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Cita } from 'src/app/models/cita';
import { Doctor } from 'src/app/models/doctor';
import { Localidad } from 'src/app/models/localidad';
import { Consultorio } from 'src/app/models/consultorio';
import { Sucursal } from 'src/app/models/sucursal';
import { Paciente } from 'src/app/models/paciente';
import { Fecha } from 'src/app/models/fecha';
import { CitaService } from 'src/app/services/cita.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css'],
  providers: [CitaService,EmpleadoService]
})
export class EmpleadoComponent implements OnInit, DoCheck {
  //Datos de Paciente
  public pacientes: Paciente[];
  //Datos de Cita
  public citas: Cita[];
  //Datos de Doctor
  public doctores: Doctor[];
  //Datos de Localidad
  public localidades: Localidad[];
  //Datos de Consultorio
  public consultorios: Consultorio[];
  //Datos de Sucursal
  public sucursales: Sucursal[];
  //Datos y Variables Generales
  public fechasEleccion: Fecha[];
  public anioMax: number = new Date().getFullYear();
  public anioMin: number = 2022;
  //Banderas y Variables de Control
  public login: string;
  public contrasenia: string;
  public mesElegido: string;
  public anioElegido: string;
  public mesPdf: string;
  public anioPdf: string;
  public tamHeaderTablaPdf: number = 65;
  constructor(
    private _citaService: CitaService,
    private _empleadoService: EmpleadoService
  ) {
    this.citas = [];
    this.pacientes = [];
    this.doctores = [];
    this.localidades = [];
    this.consultorios = [];
    this.sucursales = [];
    this.fechasEleccion = [];
    this.mesElegido = "";
    this.anioElegido = "";
    this.mesPdf = "";
    this.anioPdf = "";
    this.login = "";
    this.contrasenia = "";
  }

  ngOnInit(): void {
    $('#descarga-pdf').hide();
    $('#login-empleado').hide();
    $('#login-empleado').fadeIn(1500);
    this.setFechasEleccion();
  }

  ngDoCheck(){
    if(this.mesElegido != '' && this.anioElegido != ''){
      this.getCitasFecha();
      this.mesPdf = this.mesElegido;
      this.anioPdf = this.anioElegido;
      this.mesElegido = '';
      this.anioElegido = '';
    }
  }

  showDescargarPdf(){
    $('#login-empleado').fadeOut(200);
    $('#descarga-pdf').fadeIn(1500);
  }

  verificaEmpleado(){
    this._empleadoService.getEmpleadoLogin(this.login,this.contrasenia).subscribe(
      response => {
        if(response.empleados.length != 0){
          this.showDescargarPdf();
        }else{
          console.log("Fallo");
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getCitasFecha(){
    let localidades = this.localidades;
    let sucursales = this.sucursales;
    let pacientes = this.pacientes;
    this._citaService.getCitasFecha(this.mesElegido,this.anioElegido).subscribe(
      response => {
        if(response.citas.length != 0){
          this.citas = response.citas;
          this.consultorios = response.citas;
          this.doctores = response.citas;
          response.citas.forEach(function(elem: {
            nombre_paciente: any; paterno_paciente: any; materno_paciente: any; nombre_sucursal: any; id: any; pais: any; estado_localidad: any; codigo_postal: any; ciudad: any; calle: any; exterior: any; interior: any; 
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
            let paciente = {
              "id": -1,
              "nombre": elem.nombre_paciente,
              "paterno": elem.paterno_paciente, 
              "materno": elem.materno_paciente, 
              "curp": "",
              "correo": "",
              "telefono": "",
              "fecha_nacimiento": "",
              "sexo": "",
              "localidad_id": -1
            }
            localidades.push(localidad);
            sucursales.push(sucursal);
            pacientes.push(paciente);
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

  getConsigue(){

  }

  async generatePDF(){

    

    const imageData = await this.getBase64ImageFromURL('../../../assets/IMG/logo-la-esperanza_3.png');
    const documentDefinition = this.getDocumentDefinition(imageData);
    
    
    
    pdfMake.createPdf(documentDefinition).download();
  }

  private getDocumentDefinition(imageData: any){
    

    let definicion = {
      footer: {
        columns: [
          "",
          "",
          "",
          "",
          { 
            text: 'La Esperanza',
            style: 'boldFooter'
          }
        ]
      },
  
      content: [
        this.getEncabezado(imageData),
        this.getCitasTabla()
      ],
      styles: this.getEstilos(),
      info: {
        title: '_RESUME',
        author: 'dcas',
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      } 
      
    };
    return definicion;
  }

  private getCitasTabla(){
    let i = 0;
    console.log(this.pacientes);
    let citasTabla = {
      table: {
        widths: [this.tamHeaderTablaPdf,this.tamHeaderTablaPdf,this.tamHeaderTablaPdf,this.tamHeaderTablaPdf,this.tamHeaderTablaPdf,this.tamHeaderTablaPdf,this.tamHeaderTablaPdf],
        body: [
          [ {
            text: 'CITA',
            style: 'headerTable'
          }, 
          {
            text: 'PACIENTE',
            style: 'headerTable'
          },
          {
            text: 'DOCTOR',
            style: 'headerTable'
          },
          {
            text: 'HORA',
            style: 'headerTable'
          },
          {
            text: 'SUCURSAL',
            style: 'headerTable'
          },
          {
            text: 'CONSULTORIO',
            style: 'headerTable'
          },
          {
            text: 'UBICACIÓN',
            style: 'headerTable'
          }
          ],
          
          ...this.citas.map( elem => { 
            return [
              elem.clave_identificacion,
              this.pacientes[i].nombre+ ' ' +this.pacientes[i].paterno+ ' ' +this.pacientes[i].materno,
              this.doctores[i].nombre+ ' ' +this.doctores[i].paterno+ ' ' +this.doctores[i].materno,
              elem.hora_encuentro,
              this.sucursales[i].nombre,
              this.consultorios[i].numero_identificacion,
              this.localidades[i].calle + ', ' + this.localidades[i].exterior + ', ' + this.localidades[i].interior + ', ' + this.localidades[i].codigo_postal + ', ' + this.localidades[i].ciudad + ', ' + this.localidades[i].estado + ', ' + this.localidades[i].pais
            ];
          })
        ]
      }
    }
    return citasTabla;
  }


  private getEstilos(){
    let styles = {
      header: {
        bold: true,
        fontSize: 30
      },
      headerTable: {
        bold: true
      },
      boldFecha: {
        bold: true
      },
      boldFooter: {
        bold: true
      }
    };
    return styles;
  }
  
  private getEncabezado(imageData:any){
    
    let encabezado = {
      columns:[
        [{
          text: 'Reporte de Citas',
          style: 'header'
        },
        {
          text: 'Fecha: ' + this.mesPdf + '-' + this.anioPdf,
          style: 'boldFecha'
        }
        ],
        {
          image: 'data:image/jpeg,'+imageData,
          width: 80
        }
      ]
    };
    return encabezado;
  }

  private getBase64ImageFromURL(url:string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = createCanvas(10, 10);;
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  
  private setFechasEleccion(){
    let meses:number[] = [];
    for(let j=1; j<=12; j++){
      meses.push(j);
    }
    for(let i=this.anioMin; i<=this.anioMax;i++){
      let fecha = new Fecha(meses,i.toString());
      this.fechasEleccion.push(fecha);
    }
    console.log(this.fechasEleccion);
  }

}
