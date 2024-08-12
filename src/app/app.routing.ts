import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitaComponent } from './components/cita/cita.component';
import { EmpleadoComponent } from './components/empleado/empleado.component';
import { PacienteComponent } from './components/paciente/paciente.component';
import { PrincipalComponent } from './components/principal/principal.component';


const appRoutes: Routes = [
	{path: 'principal', component: PrincipalComponent},
	{path: 'citas', component: CitaComponent},
    {path: 'paciente', component: PacienteComponent},	
	{path: 'empleado',component: EmpleadoComponent},
	{path: '**', component: PrincipalComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);
