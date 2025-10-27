// Tipos base
export interface Usuario {
  id: number;
  correo: string;
  created_at?: string;
  updated_at?: string;
}

// Cliente
export interface Cliente extends Usuario {
  apellidoMaterno: string;
  apellidoPaterno: string;
  nombres: string;
  ci: string;
  telefono?: string;
  tipo: "cliente";
}

// Administrador
export interface Administrador extends Usuario {
  nombre?: string;
  tipo: "admin";
}

// Union type para todos los usuarios
export type UsuarioCompleto = Cliente | Administrador;

// Form Data para crear/actualizar
export interface ClienteFormData {
  correo: string;
  password?: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  nombres: string;
  ci: string;
  telefono?: string;
}

export interface AdministradorFormData {
  correo: string;
  password?: string;
  nombre?: string;
}

// Para la tabla unificada
export interface UsuarioListItem {
  id: number;
  correo: string;
  tipo: "cliente" | "admin";
  nombreCompleto: string;
  created_at?: string;
}
