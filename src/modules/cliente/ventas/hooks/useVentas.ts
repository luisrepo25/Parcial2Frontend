import { useState } from "react";
import { ventasApi } from "../services/ventasApi";
import type { CreateCheckoutRequest, EstadoVenta } from "../types";

/**
 * Hook personalizado para manejar las operaciones de ventas
 */
export const useVentas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear checkout y redirigir a Stripe
   */
  const crearCheckout = async (items: CreateCheckoutRequest["items"]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ventasApi.createCheckout({ items });

      if (!response.ok) {
        setError(response.error || "Error al crear el checkout");
        return null;
      }

      // Redirigir a Stripe
      if (response.url) {
        window.location.href = response.url;
      }

      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verificar sesión de pago
   */
  const verificarSesion = async (sessionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ventasApi.verifySession(sessionId);

      if (!response.ok) {
        setError(response.error || "Error al verificar la sesión");
        return null;
      }

      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener lista de compras
   */
  const obtenerCompras = async (estado?: EstadoVenta) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ventasApi.getMisCompras(estado);

      if (!response.ok) {
        setError(response.error || "Error al obtener las compras");
        return { compras: [], estadisticas: null };
      }

      return {
        compras: response.compras || [],
        estadisticas: response.estadisticas || null,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return { compras: [], estadisticas: null };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener detalle de una compra
   */
  const obtenerDetalleCompra = async (ventaId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ventasApi.getDetalleCompra(ventaId);

      if (!response.ok) {
        setError(response.error || "Error al obtener el detalle");
        return null;
      }

      return response.compra || null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Solicitar reembolso
   */
  const solicitarReembolso = async (ventaId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ventasApi.solicitarReembolso(ventaId);

      if (!response.ok) {
        setError(response.error || "Error al solicitar el reembolso");
        return false;
      }

      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    crearCheckout,
    verificarSesion,
    obtenerCompras,
    obtenerDetalleCompra,
    solicitarReembolso,
  };
};
