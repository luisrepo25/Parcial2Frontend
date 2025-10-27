import type { ApiResponse } from "../../../../shared/types";
import type { UsuarioListItem } from "../types";
import { authApi } from "../../../auth/services/authapi";

// Obtener la URL base de la API desde las variables de entorno
const API_URL =
  import.meta.env.VITE_API_URL + "users" || "http://127.0.0.1:8000/";

/**
 * Servicio de API para gestión de usuarios (vista unificada)
 */
export const usersApi = {
  /**
   * Obtener todos los usuarios (clientes + admins)
   * GET /users/clientes/ + GET /users/admins/
   */
  getUsers: async (): Promise<UsuarioListItem[]> => {
    try {
      // Obtener clientes y admins en paralelo
      const [clientesRes, adminsRes] = await Promise.all([
        fetch(`${API_URL}/clientes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authApi.getAuthHeaders(),
          },
        }),
        fetch(`${API_URL}/admins`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authApi.getAuthHeaders(),
          },
        }),
      ]);

      if (!clientesRes.ok || !adminsRes.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const clientesData = await clientesRes.json();
      const adminsData = await adminsRes.json();

      console.log("Clientes:", clientesData);
      console.log("Admins:", adminsData);

      // Extraer los arrays de las respuestas (pueden venir envueltos en un objeto)
      const clientesArray = clientesData.clientes || clientesData || [];
      const adminsArray = adminsData.admins || adminsData || [];

      // Transformar a formato unificado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clientesList: UsuarioListItem[] = (
        Array.isArray(clientesArray) ? clientesArray : []
      ).map((c: any) => ({
        // Manejar tanto formato nested (c.usuario) como flat (c directamente)
        id: c.usuario?.id || c.usuario_id || c.id,
        correo: c.usuario?.correo || c.correo,
        tipo: "cliente" as const,
        nombreCompleto: `${c.nombres} ${c.apellidoPaterno} ${c.apellidoMaterno}`,
        created_at: c.usuario?.created_at || c.created_at,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adminsList: UsuarioListItem[] = (
        Array.isArray(adminsArray) ? adminsArray : []
      ).map((a: any) => ({
        // Manejar tanto formato nested (a.usuario) como flat (a directamente)
        id: a.usuario?.id || a.usuario_id || a.id,
        correo: a.usuario?.correo || a.correo,
        tipo: "admin" as const,
        nombreCompleto: a.nombre || "Administrador",
        created_at: a.usuario?.created_at || a.created_at,
      }));

      return [...clientesList, ...adminsList];
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario (cliente o admin)
   * DELETE /users/clientes/{id}/delete o /users/admins/{id}/delete
   */
  deleteUser: async (
    id: number,
    tipo: "cliente" | "admin"
  ): Promise<ApiResponse<void>> => {
    try {
      const endpoint =
        tipo === "cliente"
          ? `${API_URL}/clientes/${id}/delete`
          : `${API_URL}/admins/${id}/delete`;

      const response = await fetch(endpoint, {
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
        message: `${
          tipo === "cliente" ? "Cliente" : "Administrador"
        } eliminado exitosamente`,
      };
    } catch (error) {
      console.error(`Error al eliminar usuario:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },
};

export default usersApi;
