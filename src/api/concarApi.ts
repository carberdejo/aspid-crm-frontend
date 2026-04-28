import { ApiResponse, RefreshTokenResponse } from "@/interfaces";
import { useAuthStore } from "@/store";
import axios from "axios";

export const concarApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const redirectToLogin = () => {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.replace("/auth/login");
  }
};

// 1. Interceptor de Petición: Inyectar el Access Token
concarApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  // ✅ CASO 1: Soporta que no envíen token (Lo bloquea si es privada)
  if (!token) {
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    if (!isPublicEndpoint) {
      redirectToLogin();
      // Rechazamos la promesa explícitamente para que la UI deje de cargar
      return Promise.reject(
        new axios.Cancel("No hay token. Petición cancelada."),
      );
    }
  }

  // Si hay token, lo inyecta
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor de Respuesta: Manejar Refresh Token y Contrato de Negocio
concarApi.interceptors.response.use(
  (response) => {
    if (response.data.code !== 1) {
      return Promise.reject(
        new Error(response.data.message || "Error del servidor"),
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si cancelamos la petición nosotros mismos en el request interceptor, no hacemos nada más
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // ✅ CASO 2: Si lanza 401 Unauthorized, hace el refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, updateToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No hay refresh token disponible");
        }

        console.log("Llamando al refresh...");

        const res = await axios.post<ApiResponse<RefreshTokenResponse>>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken } = res.data.data;
        console.log("Nuevo accessToken: ", accessToken);

        updateToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Usamos concarApi en lugar de axios para que la nueva respuesta
        // también pase por la validación de negocio (code !== 1)
        return concarApi(originalRequest);
      } catch (_refreshError) {
        // ✅ CASO 3: Si el refresh da error, lo bota al login
        redirectToLogin(); // <-- Ahora sí lo expulsamos de la vista
        return Promise.reject(
          new Error(
            "Su sesión ha expirado, por favor inicie sesión nuevamente.",
          ),
        );
      }
    }

    // Errores normales que no son 401
    const msg =
      error.response?.data?.message || "Error de conexión con el servidor";
    return Promise.reject(new Error(msg));
  },
);
