/**
 * Módulo de Usuarios
 * Gestión unificada de clientes y administradores
 */

// Páginas
export { default as UsersList } from "./pages/UsersList";
export { default as UserForm } from "./pages/UserForm";
export { default as UserDetail } from "./pages/UserDetail";

// Servicios API
export { default as usersApi } from "./services/usersApi";
export { default as clienteApi } from "./services/clienteApi";
export { default as adminApi } from "./services/adminApi";

// Tipos
export type {
  Usuario,
  Cliente,
  Administrador,
  UsuarioCompleto,
  ClienteFormData,
  AdministradorFormData,
  UsuarioListItem,
} from "./types";
