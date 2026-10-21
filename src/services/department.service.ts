import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  Department,
  DepartmentMember,
  PaginatedResponse,
} from "@/interfaces";

export const DepartmentService = {
  getDepartments: async () => {
    // Limpiar parámetros antes de enviar

    const { data } =
      await concarApi.get<ApiResponse<PaginatedResponse<Department>>>(
        "/departments",
      );

    return data.data; // Retorna la data paginada
  },

  // Usuarios activos del área. El admin consulta cualquiera; un empleado solo las suyas
  getMembers: async (departmentId: number) => {
    const { data } = await concarApi.get<ApiResponse<DepartmentMember[]>>(
      `/departments/${departmentId}/members`,
    );

    return data.data;
  },
};
