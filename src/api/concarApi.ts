import { ApiResponse, RefreshTokenResponse } from "@/interfaces";
import { useAuthStore } from "@/store";
import axios from "axios";

export const concarApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true, // Para enviar cookies en cada petición
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// 1. Interceptor de Petición: Inyectar el Access Token
concarApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// 2. Interceptor de Respuesta: Manejar Refresh Token y Contrato de Negocio
concarApi.interceptors.response.use(
  (response) => {
    // Si el backend responde pero el código de negocio es error (ej. 0)
    // Mantener tu validación de contrato de negocio
    if (response.data.code !== 1) {
      return Promise.reject(new Error(response.data.message || 'Error del servidor'));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y NO hemos intentado reintentar todavía
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Obtenemos el refreshToken desde el estado persistido de Zustand
        const { refreshToken, updateToken, logout } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error('No hay refresh token disponible');
        }
        console.log("llamando al refresh")
      // Llamada al endpoint de refresh pasando el token en el BODY
        // Usamos axios directamente para evitar los interceptores de esta instancia
        const res = await axios.post<ApiResponse<RefreshTokenResponse>>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refreshToken: refreshToken // <-- Enviado como body según tu backend
        });

        const {accessToken } = res.data.data; // Ajusta según tu estructura {code: 1, data: {...}}
        console.log('nuevo accestoken: ',accessToken)
        // Actualizamos Zustand y Cookies
        updateToken(accessToken);

        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest)
        
      } catch (refreshError) {
        // Si el refresh falla (el refresh token expiró), cerramos sesión
        useAuthStore.getState().logout();
        return Promise.reject(new Error('Su sesión ha expirado, por favor inicie sesión nuevamente.'));
      }
    }

    // Errores normales que no son 401
    const msg = error.response?.data?.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(msg));
  }
);
