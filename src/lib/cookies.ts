import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'auth-token';
const RETURN_TO_COOKIE_NAME = 'return-to';

export const cookieUtils = {
  // Token management
  setToken: (token: string) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, {
      expires: 7, // 7 días
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },

  // Return URL management
  setReturnTo: (url: string) => {
    Cookies.set(RETURN_TO_COOKIE_NAME, url, {
      expires: 1, // 1 día
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  getReturnTo: (): string | undefined => {
    return Cookies.get(RETURN_TO_COOKIE_NAME);
  },

  removeReturnTo: () => {
    Cookies.remove(RETURN_TO_COOKIE_NAME);
  },

  // Clear all auth cookies
  clearAuth: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(RETURN_TO_COOKIE_NAME);
  }
};