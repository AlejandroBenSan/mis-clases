import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-estudiante-modal',
  templateUrl: './nuevo-estudiante-modal.component.html',
  styleUrls: ['./nuevo-estudiante-modal.component.css']
})
export class NuevoEstudianteModalComponent {
  estudianteForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellidos: [''],
    edad: [''],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    activo: [true, Validators.required],
    fechaIngreso: [new Date()]
  });

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NuevoEstudianteModalComponent>, 
    private snackBar: MatSnackBar) {
   }

   ngOnInit(): void {
    
  }

  agregarEstudiante() {
    if (this.estudianteForm.value.nombre && this.estudianteForm.value.activo !== null) {
      // Aquí puedes manejar lo que sucede cuando el formulario es válido y los campos requeridos están llenos
      this.dialogRef.close(this.estudianteForm.value);
    } else {
      this.snackBar.open('Faltan campos por llenar o el formulario no es válido.', 'Cerrar', {
        duration: 3000, // Duración del mensaje en milisegundos
      });
    }
  }
  
}
