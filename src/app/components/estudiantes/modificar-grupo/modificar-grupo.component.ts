import { Component, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { EstudianteI } from 'src/app/interfaces/estudiante';

@Component({
  selector: 'app-modificar-grupo',
  templateUrl: './modificar-grupo.component.html',
  styleUrls: ['./modificar-grupo.component.css']
})
export class ModificarGrupoComponent {

  estudiantes: Observable<EstudianteI[]> = this.firestore.collection<EstudianteI>('estudiantes').valueChanges({ idField: 'id' });

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private firestore: AngularFirestore,
  private snackBar: MatSnackBar, private dialogRef: MatDialogRef<ModificarGrupoComponent>){
    console.log(this.data)
  }
  
  grupoForm = this.fb.group({
    id: [this.data.grupo.id],
    nombre: [this.data.grupo.nombre, Validators.required],
    precioClase: [this.data.grupo.precioClase, Validators.required],
    activo: [this.data.grupo.activo, Validators.required],
    estudiantesIds: [this.data.grupo.estudiantesIds, Validators.required],
  });

  editarGrupo(){
    if(this.grupoForm.value.nombre && this.grupoForm.value.precioClase == null){
      this.snackBar.open('Faltan campos por rellenar.', 'Cerrar', {
        duration: 3000, // Duración del mensaje en milisegundos
      });
      
    }else{
      if(this.grupoForm.value.estudiantesIds.length == 1){
        this.snackBar.open('Un grupo no puede tener solo un estudiante.', 'Cerrar', {
          duration: 3000, // Duración del mensaje en milisegundos
        });
      }else{
        this.dialogRef.close(this.grupoForm.value)
      }
      
    }
  }

}
