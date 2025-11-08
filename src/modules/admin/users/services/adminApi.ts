import type { ApiResponse } from "../../../../shared/types";
import type { Administrador, AdministradorFormData } from "../types";
import { authApi } from "../../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
const API_URL = `${API_BASE_URL}users/admins`;

/**
 * Respuesta de la API para admin con estructura nested
 */
interface AdministradorApiResponse {
  id: number;
  usuario: {
    id: number;
    correo: string;
    created_at: string;
    updated_at: string;
  };
  nombre: string | null;
}

/**
 * Servicio de API para gestión de administradores
 */
export const adminApi = {
  /**
   * Obtener todos los administradores
   * GET /users/admins
   */
  getAdmins: async (): Promise<ApiResponse<Administrador[]>> => {
    try {
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

      // Extraer el array (puede venir envuelto en un objeto con propiedad "admins")
      const data: AdministradorApiResponse[] =
        responseData.admins || responseData;

      // Transformar la respuesta nested a formato flat
      const admins: Administrador[] = (Array.isArray(data) ? data : []).map(
        (item) => ({
          id: item.usuario.id,
          correo: item.usuario.correo,
          created_at: item.usuario.created_at,
          updated_at: item.usuario.updated_at,
          nombre: item.nombre ?? undefined,
          tipo: "admin" as const,
        })
      );

      return {
        success: true,
        data: admins,
      };
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Obtener un administrador por ID
   * GET /users/admins/{id}
   */
  getAdmin: async (id: number): Promise<ApiResponse<Administrador>> => {
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

      // El API puede devolver { ok: true, admin: {...} } o directamente el admin
      const data = responseData.admin || responseData;

      // Transformar la respuesta a formato flat
      const admin: Administrador = {
        id: data.usuario_id || data.id,
        correo: data.correo,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        nombre: data.nombre ?? undefined,
        tipo: "admin" as const,
      };

      return {
        success: true,
        data: admin,
      };
    } catch (error) {
      console.error("Error al obtener administrador:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Crear un nuevo administrador
   * POST /users/admins/register
   */
  createAdmin: async (
    admin: AdministradorFormData
  ): Promise<ApiResponse<Administrador>> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(admin),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: AdministradorApiResponse = await response.json();

      // Transformar la respuesta nested a formato flat
      const nuevoAdmin: Administrador = {
        id: data.usuario.id,
        correo: data.usuario.correo,
        created_at: data.usuario.created_at,
        updated_at: data.usuario.updated_at,
        nombre: data.nombre ?? undefined,
        tipo: "admin" as const,
      };

      return {
        success: true,
        data: nuevoAdmin,
        message: "Administrador creado exitosamente",
      };
    } catch (error) {
      console.error("Error al crear administrador:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Actualizar un administrador existente
   * PUT /users/admins/{id}/update
   */
  updateAdmin: async (
    id: number,
    admin: Partial<AdministradorFormData>
  ): Promise<ApiResponse<Administrador>> => {
    try {
      const response = await fetch(`${API_URL}/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authApi.getAuthHeaders(),
        },
        body: JSON.stringify(admin),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data: AdministradorApiResponse = await response.json();

      // Transformar la respuesta nested a formato flat
      const adminActualizado: Administrador = {
        id: data.usuario.id,
        correo: data.usuario.correo,
        created_at: data.usuario.created_at,
        updated_at: data.usuario.updated_at,
        nombre: data.nombre ?? undefined,
        tipo: "admin" as const,
      };

      return {
        success: true,
        data: adminActualizado,
        message: "Administrador actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  /**
   * Eliminar un administrador
   * DELETE /users/admins/{id}/delete
   */
  deleteAdmin: async (id: number): Promise<ApiResponse<void>> => {
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
        message: "Administrador eliminado exitosamente",
      };
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default adminApi;
