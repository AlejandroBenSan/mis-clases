import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { MatSnackBar } from '@angular/material/snack-bar';
import { NuevaClaseNoFechaComponent } from './nueva-clase-no-fecha/nueva-clase-no-fecha.component';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent {

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private snackBar: MatSnackBar){

  }

  displayedColumns: string[] = ['hora', 'estudiantes', 'precio', 'estado', 'acciones'];

  addClassUndefinedDate(){
    {
      const dialogRef = this.dialog.open(NuevaClaseNoFechaComponent, {
        width: '500px',
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
  
          console.log(result);
        }
      });
    }
  }

  days = [
    {
      date: new Date(),
      classes: [
        { hora: '08:00', estudiantes: "prueba", precio: '50€', estado: 'Confirmado' },
      ]
    },
    {
      date: "2023/12/08",
      classes: [
        { hora: '15:30', estudiantes: "Maciek", precio: '60 zl', estado: 'Confirmado' },
        { hora: '20:00', estudiantes: "Natalka", precio: '50 zl', estado: 'Confirmado' },
        { hora: '21:00', estudiantes: "Natalka", precio: '50 zl', estado: 'Confirmado' },
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
