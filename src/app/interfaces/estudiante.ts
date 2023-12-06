export interface EstudianteI {
    id?: string;
    nombre: string;
    apellidos?: string;
    edad?: number;
    email?: string;
    telefono?: string;
    activo: boolean;
    fechaIngreso?: Date; // La '?' indica que esta propiedad es opcional
  }