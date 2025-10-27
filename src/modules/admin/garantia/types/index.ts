// Tipos para el módulo de Garantías
import type { Marca } from "../../Marca/types";

export interface Garantia {
  id: number;
  cobertura: number;
  descripcion: string;
  marca: Marca;
  created_at?: string;
  updated_at?: string;
}

export interface GarantiaFormData {
  cobertura: number;
  marca_id: number;
}

export type GarantiaCreateData = GarantiaFormData;
export type GarantiaUpdateData = Partial<GarantiaFormData>;
