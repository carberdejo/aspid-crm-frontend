import { Payload } from "@/interfaces";
import { cookieUtils } from "@/lib/cookies";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  user: Payload | null;
  refreshToken: string | null;
  // setToken: (token: string) => void;
  // setUser: (user: Payload) => void;
  login: (accessToken: string, refreshToken: string) => void;
  updateToken: (accessToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      refreshToken: null,

      login: (accessToken, refreshToken) => {
        const decoded = jwtDecode<Payload>(accessToken);
        const payload = {
          ...decoded,
          sub: +decoded.sub,
        };
        set({ token: accessToken, refreshToken, user: payload });
        // Guardar también en cookies para el middleware
        cookieUtils.setToken(accessToken);
      },
      updateToken: (accessToken) => {
        // El backend firma el nuevo token leyendo la BD: si el admin cambió las
        // áreas o el rol del usuario, se reflejan aquí (sidebar y acceso a rutas)
        const decoded = jwtDecode<Payload>(accessToken);
        set({ token: accessToken, user: { ...decoded, sub: +decoded.sub } });
        // Guardar también en cookies para el middleware
        cookieUtils.setToken(accessToken);
      },
      logout: () => {
        set({ token: null, user: null, refreshToken: null });
        // Limpiar cookies
        cookieUtils.clearAuth();
      },
      isAuthenticated: () => {
        const { token, user } = get();
        // Verificamos que existan ambos
        return !!(token && user);
      },
    }),
    {
      name: "auth-storage",
      // Solo persistimos el token si queremos que el user se hidrate del token al cargar      onRehydrateStorage: () => (state) => {
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Si al recargar hay un token, aseguramos que la cookie esté presente
        if (state?.token) {
          cookieUtils.setToken(state.token);
        }
      },
    },
  ),
);
