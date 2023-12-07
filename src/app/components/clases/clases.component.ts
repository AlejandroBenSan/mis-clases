import { Component } from '@angular/core';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent {

  constructor(){

  }

  displayedColumns: string[] = ['hora', 'estudiantes', 'precio', 'estado', 'acciones'];

  days = [
    {
      date: new Date(),
      classes: [
        { hora: '08:00', estudiantes: 20, precio: '50€', estado: 'Confirmado' },
      ]
    },
    {
      date: "2023/12/08",
      classes: [
        { hora: '08:00', estudiantes: 20, precio: '50€', estado: 'Confirmado' },
      ]
    }
  ];

  addClass(day:any): void {
    // Lógica para añadir una nueva clase
  }

  editClass(clase:any): void {
    // Lógica para editar una clase
    console.log('Editar clase', clase);
  }

  deleteClass(clase:any): void {
    // Lógica para eliminar una clase
    console.log('Eliminar clase', clase);
  }

  doneClass(clase:any): void {
    // Lógica para eliminar una clase
    console.log('Realizada clase', clase);
  }

}
