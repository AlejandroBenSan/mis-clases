import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent {

  constructor(){}

  displayedColumns: string[] = ['nombre', 'apellido']; // ... otras columnas
  dataSource = new MatTableDataSource(ELEMENT_DATA); // Reemplaza ELEMENT_DATA con tus datos

  nuevoEstudiante(){

  }


}

// Reemplaza esta estructura con la estructura de datos de tus estudiantes
export interface Estudiante {
  nombre: string;
  apellido: string;
  // ... otras propiedades
}

// Datos de ejemplo
const ELEMENT_DATA: Estudiante[] = [
  {nombre: 'Juan', apellido: 'Pérez'},
  {nombre: 'María', apellido: 'González'},
  // ... más estudiantes
];
