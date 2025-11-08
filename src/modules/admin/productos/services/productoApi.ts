import type { ApiResponse } from "../../../../shared/types";
import type { Producto, ProductoFormData } from "../types";
import { authApi } from "../../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
const API_URL = `${API_BASE_URL}products/`;

/**
 * Servicio de API para gestión de productos
 */
export const productoApi = {
  /**
   * Obtener todos los productos
   * GET /productos
   */
  getProductos: async (): Promise<Producto[]> => {
    try {
      const response = await fetch(`${API_URL}productos`, {
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
      console.log("Respuesta de productos:", data);

      // Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        return data;
      } else if (data.productos && Array.isArray(data.productos)) {
        return data.productos;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.results && Array.isArray(data.results)) {
        return data.results;
      }

      console.warn("Formato de respuesta inesperado:", data);
      return [];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  /**
   * Obtener un producto por ID
   * GET /productos/{id}
   */
  getProducto: async (id: number): Promise<Producto> => {
    try {
      const response = await fetch(`${API_URL}productos/${id}`, {
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
      console.log("Respuesta de producto:", data);

      if (data.producto) {
        return data.producto;
      } else if (data.data) {
        return data.data;
      }

      return data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   * POST /productos/create
   */
  createProducto: async (
    producto: ProductoFormData
  ): Promise<ApiResponse<Producto>> => {
    try {
      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("descripcion", producto.descripcion);
      formData.append("precio", producto.precio.toString());
      formData.append("stock", producto.stock.toString());
      formData.append("categoria_id", producto.categoria_id.toString());
      formData.append("marca_id", producto.marca_id.toString());

      if (producto.garantia_id && producto.garantia_id > 0) {
        formData.append("garantia_id", producto.garantia_id.toString());
      }

      if (producto.imagen) {
        formData.append("imagen", producto.imagen);
      }

      // Obtener headers de autenticación sin Content-Type
      const authHeaders = authApi.getAuthHeaders() as Record<string, string>;
      // Eliminar Content-Type para que el navegador lo establezca automáticamente
      delete authHeaders["Content-Type"];

      const response = await fetch(`${API_URL}productos/create`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.producto || data,
        message: data.message || "Producto creado exitosamente",
      };
    } catch (error) {
      console.error("Error al crear producto:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
  /**
   * Actualizar un producto existente
   * PUT /productos/{id}/update
   */ updateProducto: async (
    id: number,
    producto: Partial<ProductoFormData>
  ): Promise<ApiResponse<Producto>> => {
    try {
      const formData = new FormData();

      if (producto.nombre) formData.append("nombre", producto.nombre);
      if (producto.descripcion)
        formData.append("descripcion", producto.descripcion);
      if (producto.precio !== undefined)
        formData.append("precio", producto.precio.toString());
      if (producto.stock !== undefined)
        formData.append("stock", producto.stock.toString());
      if (producto.categoria_id)
        formData.append("categoria_id", producto.categoria_id.toString());
      if (producto.marca_id)
        formData.append("marca_id", producto.marca_id.toString());

      if (producto.garantia_id && producto.garantia_id > 0) {
        formData.append("garantia_id", producto.garantia_id.toString());
      }

      if (producto.imagen) {
        formData.append("imagen", producto.imagen);
      }

      // Obtener headers de autenticación sin Content-Type
      const authHeaders = authApi.getAuthHeaders() as Record<string, string>;
      // Eliminar Content-Type para que el navegador lo establezca automáticamente
      delete authHeaders["Content-Type"];

      const response = await fetch(`${API_URL}productos/${id}/update`, {
        method: "POST",
        headers: authHeaders,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.producto || data,
        message: data.message || "Producto actualizado exitosamente",
      };
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar un producto
   * DELETE /productos/{id}/delete
   */
  deleteProducto: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}productos/${id}/delete`, {
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
        message: "Producto eliminado exitosamente",
      };
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default productoApi;
