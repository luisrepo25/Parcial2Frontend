// ===== TIPOS DE DATOS PARA VENTAS =====

// Estado de la nota de venta
export type EstadoVenta =
  | "pendiente"
  | "pagada"
  | "fallida"
  | "cancelada"
  | "reembolsada";

// ===== REQUEST TYPES =====

export interface CheckoutItem {
  producto_id: number;
  cantidad: number;
}

export interface CreateCheckoutRequest {
  items: CheckoutItem[];
}

// ===== RESPONSE TYPES =====

export interface CreateCheckoutResponse {
  ok: boolean;
  session_id?: string;
  url?: string;
  nota_venta_id?: number;
  total?: number;
  error?: string;
}

export interface VerifySessionResponse {
  ok: boolean;
  session?: {
    id: string;
    status: string;
    payment_status: string;
    amount_total: number;
  };
  nota_venta?: {
    id: number;
    estado: EstadoVenta;
    total: number;
  };
  error?: string;
}

export interface MetodoPago {
  nombre: string;
  descripcion: string;
}

export interface ProductoVenta {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  categoria?: string;
  marca?: string;
  garantia?: {
    cobertura: number;
  };
}

export interface DetalleVenta {
  producto: ProductoVenta;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface NotaVenta {
  id: number;
  total: number;
  estado: EstadoVenta;
  metodo_pago: string | MetodoPago;
  created_at: string;
  updated_at?: string;
  usuario?: {
    email: string;
  };
  detalles: DetalleVenta[];
}

export interface EstadisticasCompras {
  total_compras: number;
  compras_pagadas: number;
  compras_pendientes: number;
  total_gastado: number;
}

export interface MisComprasResponse {
  ok: boolean;
  compras?: NotaVenta[];
  estadisticas?: EstadisticasCompras;
  error?: string;
}

export interface DetalleCompraResponse {
  ok: boolean;
  compra?: NotaVenta;
  error?: string;
}

export interface ReembolsoResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

// ===== ERROR TYPES =====

export interface ApiError {
  ok: false;
  error: string;
}
