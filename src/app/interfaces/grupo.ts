import { EstudianteI } from "./estudiante";

export interface GrupoI {
  id: string;
  activo: string;
  estudiantesIds: string[];
  nombre: string;
  precioClase: number;
  estudiantes?: EstudianteI[]; // Esto es opcional y se añadirá más tarde
}