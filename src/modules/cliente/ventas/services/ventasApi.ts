import { authApi } from "../../../auth/services/authapi";
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  VerifySessionResponse,
  MisComprasResponse,
  DetalleCompraResponse,
  ReembolsoResponse,
  EstadoVenta,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/";
const API_URL = `${API_BASE_URL}sales`;

// ===== SERVICIO DE VENTAS =====

export const ventasApi = {
  /**
   * 1. 🛒 Crear Checkout con Stripe
   * Crea una sesión de pago en Stripe y genera la URL para que el usuario complete el pago
   */
  createCheckout: async (
    data: CreateCheckoutRequest
  ): Promise<CreateCheckoutResponse> => {
    try {
      const token = authApi.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_URL}/checkout/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || "Error al crear el checkout",
        };
      }

      return result;
    } catch (error) {
      console.error("Error en createCheckout:", error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar la solicitud",
      };
    }
  },

  /**
   * 2. ✅ Verificar Sesión de Pago
   * Verifica el estado de una sesión de Stripe después de que el usuario complete el pago
   */
  verifySession: async (sessionId: string): Promise<VerifySessionResponse> => {
    try {
      const token = authApi.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_URL}/checkout/verify/${sessionId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || "Error al verificar la sesión",
        };
      }

      return result;
    } catch (error) {
      console.error("Error en verifySession:", error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al verificar la sesión",
      };
    }
  },

  /**
   * 3. 📋 Listar Mis Compras
   * Obtiene todas las compras del usuario autenticado con estadísticas
   */
  getMisCompras: async (estado?: EstadoVenta): Promise<MisComprasResponse> => {
    try {
      const token = authApi.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const url = estado
        ? `${API_URL}/mis-compras/?estado=${estado}`
        : `${API_URL}/mis-compras/`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || "Error al obtener las compras",
        };
      }

      return result;
    } catch (error) {
      console.error("Error en getMisCompras:", error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al obtener las compras",
      };
    }
  },

  /**
   * 4. 📄 Detalle de Compra
   * Obtiene el detalle completo de una compra específica
   */
  getDetalleCompra: async (ventaId: number): Promise<DetalleCompraResponse> => {
    try {
      const token = authApi.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_URL}/mis-compras/${ventaId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || "Error al obtener el detalle de la compra",
        };
      }

      return result;
    } catch (error) {
      console.error("Error en getDetalleCompra:", error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al obtener el detalle",
      };
    }
  },

  /**
   * 5. 💸 Solicitar Reembolso
   * Solicita un reembolso para una compra pagada
   */
  solicitarReembolso: async (ventaId: number): Promise<ReembolsoResponse> => {
    try {
      const token = authApi.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_URL}/reembolso/${ventaId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: result.error || "Error al solicitar el reembolso",
        };
      }

      return result;
    } catch (error) {
      console.error("Error en solicitarReembolso:", error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al solicitar el reembolso",
      };
    }
  },
};
