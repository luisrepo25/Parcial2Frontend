// Tipos compartidos para toda la aplicación

// Ejemplo de tipos comunes
export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "vendedor" | "usuario";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Añade más tipos compartidos según necesites
