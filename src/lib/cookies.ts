import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "auth-token";
const RETURN_TO_COOKIE_NAME = "return-to";

export const cookieUtils = {
  // Token management
  setToken: (token: string) => {
    try {
      Cookies.set(TOKEN_COOKIE_NAME, token, {
        expires: 7, // 7 días
        path: "/", // 🔴 CRÍTICO: Asegurar que la cookie se envíe a todas las rutas
        secure: false, // 🔴 Cambiar a false en producción HTTP
        sameSite: "Lax", // 🔴 'Lax' en lugar de 'lax'
      });
      console.log("✅ Cookie auth-token guardada correctamente");
    } catch (error) {
      console.error("❌ Error guardando cookie:", error);
    }
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
  },

  // Return URL management
  setReturnTo: (url: string) => {
    try {
      Cookies.set(RETURN_TO_COOKIE_NAME, url, {
        expires: 1, // 1 día
        path: "/", // 🔴 CRÍTICO: Asegurar que la cookie se envíe a todas las rutas
        secure: false, // 🔴 Cambiar a false en producción HTTP
        sameSite: "Lax", // 🔴 'Lax' en lugar de 'lax'
      });
      console.log("✅ Cookie return-to guardada correctamente");
    } catch (error) {
      console.error("❌ Error guardando cookie return-to:", error);
    }
  },

  getReturnTo: (): string | undefined => {
    return Cookies.get(RETURN_TO_COOKIE_NAME);
  },

  removeReturnTo: () => {
    Cookies.remove(RETURN_TO_COOKIE_NAME);
  },

  // Clear all auth cookies
  clearAuth: () => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: "/" });
    Cookies.remove(RETURN_TO_COOKIE_NAME, { path: "/" });
  },
};
