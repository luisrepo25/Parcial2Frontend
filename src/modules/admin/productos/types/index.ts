// Tipos para el módulo de Productos
import type { Categoria } from "../../categoria/types";
import type { Marca } from "../../Marca/types";
import type { Garantia } from "../../garantia/types";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url?: string;
  categoria: Categoria;
  marca: Marca;
  garantia?: Garantia;
  created_at?: string;
  updated_at?: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen?: File | null;
  categoria_id: number;
  marca_id: number;
  garantia_id?: number;
}

export type ProductoCreateData = ProductoFormData;
export type ProductoUpdateData = Partial<ProductoFormData>;
