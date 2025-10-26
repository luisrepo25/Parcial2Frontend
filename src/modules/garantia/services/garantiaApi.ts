import type { ApiResponse } from "../../../shared/types";
import type { Garantia, GarantiaFormData } from "../types";
import { authApi } from "../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_URL =
  import.meta.env.VITE_API_URL + "products/" || "http://127.0.0.1:8000/";

/**
 * Servicio de API para gestión de garantías
 */
export const garantiaApi = {
  /**
   * Obtener todas las garantías
   * GET /garantias
   */
  getGarantias: async (): Promise<Garantia[]> => {
    try {
      const response = await fetch(`${API_URL}garantias`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta de garantías:", data);

      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        return data;
      } else if (data.garantias && Array.isArray(data.garantias)) {
        return data.garantias;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      }

      console.warn("Formato de respuesta inesperado:", data);
      return [];
    } catch (error) {
      console.error("Error al obtener garantías:", error);
      throw error;
    }
  },

  /**
   * Obtener una garantía por ID
   * GET /garantias/{id}
   */
  getGarantia: async (id: number): Promise<Garantia> => {
    try {
      const response = await fetch(`${API_URL}garantias/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Respuesta de garantía:", data);

      if (data.garantia) {
        return data.garantia;
      } else if (data.data) {
        return data.data;
      }

      return data;
    } catch (error) {
      console.error(`Error al obtener garantía ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva garantía
   * POST /garantias/create
   */
  createGarantia: async (
    garantia: GarantiaFormData
  ): Promise<ApiResponse<Garantia>> => {
    try {
      const response = await fetch(`${API_URL}garantias/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(garantia),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Garantía creada exitosamente",
      };
    } catch (error) {
      console.error("Error al crear garantía:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Actualizar una garantía existente
   * PUT /garantias/{id}/update
   */
  updateGarantia: async (
    id: number,
    garantia: Partial<GarantiaFormData>
  ): Promise<ApiResponse<Garantia>> => {
    try {
      const response = await fetch(`${API_URL}garantias/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(garantia),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Garantía actualizada exitosamente",
      };
    } catch (error) {
      console.error(`Error al actualizar garantía ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar una garantía
   * DELETE /garantias/{id}/delete
   */
  deleteGarantia: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}garantias/${id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: "Garantía eliminada exitosamente",
      };
    } catch (error) {
      console.error(`Error al eliminar garantía ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default garantiaApi;
