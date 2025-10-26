// Tipos para el módulo de Categorías

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion?: string;
}

export type CategoriaCreateData = CategoriaFormData;
export type CategoriaUpdateData = Partial<CategoriaFormData>;
