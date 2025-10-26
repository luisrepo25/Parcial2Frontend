import type { ApiResponse } from "../../../shared/types";
import type { Marca, MarcaFormData } from "../types";
import { authApi } from "../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_URL =
  import.meta.env.VITE_API_URL + "products/" || "http://127.0.0.1:8000/";

/**
 * Servicio de API para gestión de marcas
 */
export const marcaApi = {
  /**
   * Obtener todas las marcas
   * GET /marcas
   */
  getMarcas: async (): Promise<Marca[]> => {
    try {
      const response = await fetch(`${API_URL}marcas`, {
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
      console.log("Respuesta de marcas:", data);

      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        return data;
      } else if (data.marcas && Array.isArray(data.marcas)) {
        return data.marcas;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      }

      console.warn("Formato de respuesta inesperado:", data);
      return [];
    } catch (error) {
      console.error("Error al obtener marcas:", error);
      throw error;
    }
  },

  /**
   * Obtener una marca por ID
   * GET /marcas/{id}
   */
  getMarca: async (id: number): Promise<Marca> => {
    try {
      const response = await fetch(`${API_URL}marcas/${id}`, {
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
      console.log("Respuesta de marca:", data);

      if (data.marca) {
        return data.marca;
      } else if (data.data) {
        return data.data;
      }

      return data;
    } catch (error) {
      console.error(`Error al obtener marca ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva marca
   * POST /marcas/create
   */
  createMarca: async (marca: MarcaFormData): Promise<ApiResponse<Marca>> => {
    try {
      const response = await fetch(`${API_URL}marcas/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(marca),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Marca creada exitosamente",
      };
    } catch (error) {
      console.error("Error al crear marca:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Actualizar una marca existente
   * PUT /marcas/{id}/update
   */
  updateMarca: async (
    id: number,
    marca: Partial<MarcaFormData>
  ): Promise<ApiResponse<Marca>> => {
    try {
      const response = await fetch(`${API_URL}marcas/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(marca),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Marca actualizada exitosamente",
      };
    } catch (error) {
      console.error(`Error al actualizar marca ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar una marca
   * DELETE /marcas/{id}/delete
   */
  deleteMarca: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}marcas/${id}/delete`, {
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
        message: "Marca eliminada exitosamente",
      };
    } catch (error) {
      console.error(`Error al eliminar marca ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default marcaApi;
