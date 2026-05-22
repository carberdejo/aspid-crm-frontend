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
        // const decoded = jwtDecode<Payload>(accessToken);
        // Al refrescar, el user sigue siendo el mismo pero el token cambia
        set({ token: accessToken });
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
