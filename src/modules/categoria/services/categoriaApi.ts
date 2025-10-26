import type { ApiResponse } from "../../../shared/types";
import type { Categoria, CategoriaFormData } from "../types";
import { authApi } from "../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_URL =
  import.meta.env.VITE_API_URL + "products/" || "http://127.0.0.1:8000/";

/**
 * Servicio de API para gestión de categorías
 */
export const categoriaApi = {
  /**
   * Obtener todas las categorías
   * GET /categorias
   */
  getCategorias: async (): Promise<Categoria[]> => {
    try {
      const response = await fetch(`${API_URL}categorias`, {
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
      console.log("Respuesta de categorías:", data); // Para debug

      // Si la respuesta es un objeto con una propiedad que contiene el array
      // ajusta según la estructura real de tu API
      if (Array.isArray(data)) {
        return data;
      } else if (data.categorias && Array.isArray(data.categorias)) {
        return data.categorias;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      }

      // Si no es ninguno de los casos anteriores, devolver array vacío
      console.warn("Formato de respuesta inesperado:", data);
      return [];
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  /**
   * Obtener una categoría por ID
   * GET /categorias/{id}
   */
  getCategoria: async (id: number): Promise<Categoria> => {
    try {
      const response = await fetch(`${API_URL}categorias/${id}`, {
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
      console.log("Respuesta de categoría:", data); // Para debug

      // Si la respuesta viene envuelta en un objeto, extraer la categoría
      if (data.categoria) {
        return data.categoria;
      } else if (data.data) {
        return data.data;
      }

      return data;
    } catch (error) {
      console.error(`Error al obtener categoría ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva categoría
   * POST /categorias/create
   */
  createCategoria: async (
    categoria: CategoriaFormData
  ): Promise<ApiResponse<Categoria>> => {
    try {
      const response = await fetch(`${API_URL}categorias/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Categoría creada exitosamente",
      };
    } catch (error) {
      console.error("Error al crear categoría:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Actualizar una categoría existente
   * PUT /categorias/{id}/update
   */
  updateCategoria: async (
    id: number,
    categoria: Partial<CategoriaFormData>
  ): Promise<ApiResponse<Categoria>> => {
    try {
      const response = await fetch(`${API_URL}categorias/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: "Categoría actualizada exitosamente",
      };
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar una categoría
   * DELETE /categorias/{id}/delete
   */
  deleteCategoria: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}categorias/${id}/delete`, {
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
        message: "Categoría eliminada exitosamente",
      };
    } catch (error) {
      console.error(`Error al eliminar categoría ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default categoriaApi;
