import type { ApiResponse } from "../../../../shared/types";
import type { Cliente, ClienteFormData } from "../types";
import { authApi } from "../../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
const API_URL = `${API_BASE_URL}users/clientes`;

/**
 * Respuesta de la API para cliente con estructura nested
 */
interface ClienteApiResponse {
  id: number;
  usuario: {
    id: number;
    correo: string;
    created_at: string;
    updated_at: string;
  };
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ci: string;
  telefono: string;
}

/**
 * Servicio de API para gestión de clientes
 */
export const clienteApi = {
  /**
   * Obtener todos los clientes
   * GET /users/clientes
   */
  getClientes: async (): Promise<ApiResponse<Cliente[]>> => {
    try {
      // Imprimir en consola la URL de la API utilizada
      console.log("API URL utilizada para obtener clientes:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Extraer el array (puede venir envuelto en un objeto con propiedad "clientes")
      const data: ClienteApiResponse[] = responseData.clientes || responseData;

      // Transformar la respuesta nested a formato flat
      const clientes: Cliente[] = (Array.isArray(data) ? data : []).map(
        (item) => ({
          id: item.usuario.id,
          correo: item.usuario.correo,
          created_at: item.usuario.created_at,
          updated_at: item.usuario.updated_at,
          nombres: item.nombres,
          apellidoPaterno: item.apellidoPaterno,
          apellidoMaterno: item.apellidoMaterno,
          ci: item.ci,
          telefono: item.telefono,
          tipo: "cliente" as const,
        })
      );

      console.log("Clientes obtenidos:", clientes);

      return {
        success: true,
        data: clientes,
      };
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Obtener un cliente por ID
   * GET /users/clientes/{id}
   */
  getCliente: async (id: number): Promise<ApiResponse<Cliente>> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();

      // El API devuelve { ok: true, cliente: {...} }
      // Necesitamos extraer el objeto cliente
      const data = responseData.cliente || responseData;

      // Transformar la respuesta a formato flat
      const cliente: Cliente = {
        id: data.usuario_id || data.id,
        correo: data.correo,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        nombres: data.nombres,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        ci: data.ci,
        telefono: data.telefono,
        tipo: "cliente" as const,
      };

      return {
        success: true,
        data: cliente,
      };
    } catch (error) {
      console.error("Error al obtener cliente:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Crear un nuevo cliente
   * POST /users/clientes/register
   */
  createCliente: async (
    cliente: ClienteFormData
  ): Promise<ApiResponse<Cliente>> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: ClienteApiResponse = await response.json();

      // Transformar la respuesta nested a formato flat
      const nuevoCliente: Cliente = {
        id: data.usuario.id,
        correo: data.usuario.correo,
        created_at: data.usuario.created_at,
        updated_at: data.usuario.updated_at,
        nombres: data.nombres,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        ci: data.ci,
        telefono: data.telefono,
        tipo: "cliente" as const,
      };

      return {
        success: true,
        data: nuevoCliente,
        message: "Cliente creado exitosamente",
      };
    } catch (error) {
      console.error("Error al crear cliente:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Actualizar un cliente existente
   * PUT /users/clientes/{id}/update
   */
  updateCliente: async (
    id: number,
    cliente: Partial<ClienteFormData>
  ): Promise<ApiResponse<Cliente>> => {
    try {
      const response = await fetch(`${API_URL}/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: ClienteApiResponse = await response.json();

      // Transformar la respuesta nested a formato flat
      const clienteActualizado: Cliente = {
        id: data.usuario.id,
        correo: data.usuario.correo,
        created_at: data.usuario.created_at,
        updated_at: data.usuario.updated_at,
        nombres: data.nombres,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        ci: data.ci,
        telefono: data.telefono,
        tipo: "cliente" as const,
      };

      return {
        success: true,
        data: clienteActualizado,
        message: "Cliente actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar un cliente
   * DELETE /users/clientes/{id}/delete
   */
  deleteCliente: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_URL}/${id}/delete`, {
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
        message: "Cliente eliminado exitosamente",
      };
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default clienteApi;
