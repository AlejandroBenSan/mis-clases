import { EstudianteI } from "./estudiante";

export interface ClaseI {
    id?: string;
    estudiantes: EstudianteI[];
    fecha: Date;
    hora: Date;
    precio:number;
    contenido?: string;
    deberes?: string;
    estado: string;
    documentos?:string[]
  }