import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Observable, forkJoin,map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GrupoI } from 'src/app/interfaces/grupo';
import { MatTableDataSource } from '@angular/material/table';
import { CrearGrupoComponent } from '../crear-grupo/crear-grupo.component';
import { EstudianteI } from 'src/app/interfaces/estudiante';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent {

  grupos: Observable<GrupoI[]> = this.firestore.collection<GrupoI>('grupos').valueChanges({ idField: 'id' });
  dataSource: MatTableDataSource<GrupoI>
  displayedColumns: string[] = ['nombre', 'estudiantes', 'precio clase','acciones'];
  estudiantesNombres: {[id: string]: string} = {};

  constructor(private firestore: AngularFirestore, public dialog: MatDialog, private snackBar: MatSnackBar){
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    this.cargarDatos();
    this.grupos.forEach(grupo =>{
      grupo.forEach(g => {
        console.log(g)
      })
    })
  }

  cargarDatos() {
    this.obtenerGrupos();

    //Obtener los nombres 
    this.firestore.collection('estudiantes').snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        const estudiante = action.payload.doc.data() as EstudianteI;
        const id = action.payload.doc.id;
        this.estudiantesNombres[id] = `${estudiante.nombre} ${estudiante.apellidos}`;
      });
    });
  }

  getStudentNamesTooltip(estudiantesIds: string[]): string {
    return estudiantesIds.map(id => this.estudiantesNombres[id]).join(', ');
  }

  
  obtenerGrupos() {
    this.grupos = this.firestore.collection<GrupoI>('grupos', ref => 
      ref.where('activo', '==', "true")
    ).valueChanges({ idField: 'id' });

    this.grupos.subscribe(data => {


      this.firestore.collection('estudiantes').snapshotChanges().subscribe(actions => {
        actions.forEach(action => {
          const estudiante = action.payload.doc.data() as EstudianteI;
          const id = action.payload.doc.id;
          this.estudiantesNombres[id] = `${estudiante.nombre} ${estudiante.apellidos}`;
        });
      });
      
      this.dataSource = new MatTableDataSource(data);
      
    });
  }

  nuevoGrupo(){
    const dialogRef = this.dialog.open(CrearGrupoComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarGrupo(grupo: GrupoI){

  }

  eliminarGrupo(grupo: GrupoI){

  }
}
