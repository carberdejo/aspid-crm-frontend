import { concarApi } from "@/api/concarApi";
import { UserProfile } from "@/interfaces";
import {
  ApiResponse,
  LoginDto,
  LoginResponse,
  Logout,
  ResponseOperation,
} from "@/interfaces/api.interface";

export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    // Enviamos email y password al backend
    // Log the full target URL to help debug missing/incorrect baseURL in production

    console.log(
      "[authService] POST ->",
      `${concarApi.defaults.baseURL || ""}/auth/login`,
    );
    const { data } = await concarApi.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );

    // El interceptor ya validó que code === 1, así que retornamos la data limpia
    return data.data;
  },

  // Ejemplo de logout si necesitas avisar al backend
  logout: async () => {
    await concarApi.post("/auth/logout");
  },
  /**
   * Obtener perfil de usuario
   */
  getProfile: async (codUser: string): Promise<UserProfile> => {
    const { data } = await concarApi.get<ApiResponse<UserProfile>>(
      `/auth/profile/${codUser}`,
    );
    return data.data;
  },

  // Cierra una sesión específica por ID
  terminateSession: async (logout: Logout): Promise<ResponseOperation> => {
    console.log("🚀 Payload enviado al servidor:", logout);
    const { data } = await concarApi.post<ApiResponse<ResponseOperation>>(
      `/auth/logout`,
      logout,
    );
    return data.data;
  },

  // Cierra todas las sesiones excepto la actual (o todas)
  terminateAllSessions: async (logout: Logout) => {
    console.log("🚀 Payload enviado al servidor ALL:", logout);
    const { data } = await concarApi.post("/auth/logout", logout);
    return data;
  },
};
