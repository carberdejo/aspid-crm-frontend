import { aspidApi } from "@/api/aspidApi";
import { UserCreateDto, UserDetail, UserFilters } from "@/interfaces";
import {
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
  User,
} from "@/interfaces";

/**
 * Limpia los parámetros para que no envíe valores undefined o vacíos
 */
const cleanParams = (
  params: Record<string, string | number | undefined>,
): Record<string, string | number> => {
  const cleaned: Record<string, string | number> = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];
    // Solo agregar si tiene valor y no es string vacío
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

export const userService = {
  /**
   * Obtener usuarios con filtros opcionales
   */
  getUsers: async (
    filters: UserFilters = {},
  ): Promise<PaginatedResponse<User>> => {
    // Limpiar parámetros antes de enviar
    const params = cleanParams(
      filters as Record<string, string | number | undefined>,
    );

    const { data } = await aspidApi.get<ApiResponse<PaginatedResponse<User>>>(
      "/users",
      {
        params,
      },
    );

    return data.data;
  },

  /**
   * Obtener un usuario por su código
   */
  getById: async (codUser: number): Promise<UserDetail> => {
    const { data } = await aspidApi.get<ApiResponse<UserDetail>>(
      `/users/${codUser}`,
    );
    return data.data;
  },

  /**
   * Crear nuevo usuario
   */
  create: async (userData: UserCreateDto): Promise<string> => {
    // console.log({userData})
    const { data } = await aspidApi.post<ApiResponse<ResponseOperation>>(
      "/users",
      userData,
    );
    return data.data.message; // Retornar solo el mensaje del servidor
  },

  /**
   * Actualizar usuario existente
   */
  update: async (codUser: number, userData: Partial<User>): Promise<User> => {
    const { data } = await aspidApi.patch<ApiResponse<User>>(
      `/users/${codUser}`,
      userData,
    );
    return data.data;
  },

  /**
   * Eliminar usuario
   */
  delete: async (codUser: number): Promise<void> => {
    await aspidApi.delete(`/users/${codUser}`);
  },
};
