import { EstudianteI } from "./estudiante";

export interface ClaseI {
    id?: string;
    idParticular?: string; //El id del estudiante en el caso de que sea particular
    idGrupo?: string; //El id del grupo en el caso de que sea clase de grupo
    nombreGrupo?: string;
    estudiantesIds?: string[] // Se almacenaran los ids de los estudiantes en el caso de que sea un grupo
    estudiantes: EstudianteI[]
    fechaHora: Date;
    duracion: number;
    precio:number;
    contenido?: string;
    deberes?: string;
    estado: string;
    documentos?:string[]
  }