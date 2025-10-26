// Tipos para el módulo de Autenticación

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface Administrador {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  correo: string;
  token: string;
  rol: string;
  administrador?: Administrador;
}

export interface LoginResponse {
  ok: boolean;
  usuario: Usuario;
}
