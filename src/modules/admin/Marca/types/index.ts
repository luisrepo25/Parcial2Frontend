// Tipos para el módulo de Marcas

export interface Marca {
  id: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarcaFormData {
  nombre: string;
  descripcion?: string;
}

export type MarcaCreateData = MarcaFormData;
export type MarcaUpdateData = Partial<MarcaFormData>;
