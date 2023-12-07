import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modificar-estudiante',
  templateUrl: './modificar-estudiante.component.html',
  styleUrls: ['./modificar-estudiante.component.css']
})
export class ModificarEstudianteComponent {

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ModificarEstudianteComponent>,
    private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any){

  }

  estudianteForm = this.fb.group({
    id: [this.data.estudiante.id],
    nombre: [this.data.estudiante.nombre, Validators.required],
    apellidos: [this.data.estudiante.apellidos],
    edad: [this.data.estudiante.edad],
    email: [this.data.estudiante.email, [Validators.required, Validators.email]],
    telefono: [this.data.estudiante.telefono],
    activo: [this.data.estudiante.activo, Validators.required],
    fechaIngreso: [this.data.estudiante.fechaIngreso || new Date()]
});

  editarEstudiante() {
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


