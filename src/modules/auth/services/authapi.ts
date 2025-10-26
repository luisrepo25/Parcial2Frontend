import type { LoginCredentials, LoginResponse, Usuario } from "../types";

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";

// Clave para el localStorage
const TOKEN_KEY = "smartsales_token";
const USER_KEY = "smartsales_user";

/**
 * Servicio de autenticación
 */
export const authApi = {
  /**
   * Iniciar sesión
   * POST /users/auth
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}users/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();

      if (data.ok && data.usuario) {
        // Guardar token y usuario en localStorage
        authApi.saveToken(data.usuario.token);
        authApi.saveUser(data.usuario);
      }

      return data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Guardar token en localStorage
   */
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Obtener token del localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Guardar usuario en localStorage
   */
  saveUser: (user: Usuario) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Obtener usuario del localStorage
   */
  getUser: (): Usuario | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    const token = authApi.getToken();
    return token !== null;
  },

  /**
   * Obtener headers con autenticación
   */
  getAuthHeaders: (): HeadersInit => {
    const token = authApi.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};

export default authApi;
