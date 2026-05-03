import { concarApi } from "@/api/concarApi";
import { ApiResponse, Department, PaginatedResponse } from "@/interfaces";

export const DepartmentService = {
  getDepartments: async () => {
    // Limpiar parámetros antes de enviar

    const { data } =
      await concarApi.get<ApiResponse<PaginatedResponse<Department>>>(
        "/departments",
      );

    return data.data; // Retorna la data paginada
  },
};
