import { concarApi } from "@/api/concarApi";
import { ApiResponse, Department } from "@/interfaces";


export const DepartmentService = {

     getDepartments:async () => {
    // Limpiar parámetros antes de enviar
    
    const { data } = await concarApi.get<ApiResponse<Department[]>>('/departments');
    
    return data.data; // Retorna la data paginada
  },

}