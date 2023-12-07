import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteI } from 'src/app/interfaces/estudiante';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Component({
  selector: 'app-nueva-clase-no-fecha',
  templateUrl: './nueva-clase-no-fecha.component.html',
  styleUrls: ['./nueva-clase-no-fecha.component.css']
})
export class NuevaClaseNoFechaComponent {

  claseForm: FormGroup;
  estudiantes: Observable<EstudianteI[]> = this.firestore.collection<EstudianteI>('estudiantes').valueChanges({ idField: 'id' });
  

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NuevaClaseNoFechaComponent>, 
    private snackBar: MatSnackBar, private firestore: AngularFirestore){

      this.claseForm = this.fb.group({
        id: [''], // Opcional, por lo general no se incluye en el formulario
        estudiantes: this.fb.array([], Validators.required), // Se maneja como un array de form controls
        fecha: [null, Validators.required],
        hora: [null, Validators.required],
        precio: [null, [Validators.required, Validators.min(0)]],
        contenido: [''],
        deberes: [''],
        estado: ['', Validators.required],
        urlDocumento: [''] // Opcional, depende de si quieres manejar documentos
      });

  }

  ngOnInit(): void {
    
  }


}
