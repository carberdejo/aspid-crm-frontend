import { aspidApi } from "@/api/aspidApi";
import {
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
} from "@/interfaces";
import {
  VisitCreateDto,
  VisitFilter,
  VisitItem,
  VisitListItem,
} from "@/interfaces/visit.interface";
import { cleanParams } from "@/lib/utils";

export const VisitService = {
  create: async (create: VisitCreateDto): Promise<ResponseOperation> => {
    const { data } = await aspidApi.post<ApiResponse<ResponseOperation>>(
      "/visits",
      create,
    );
    return data.data;
  },
  getVisits: async (
    filters: VisitFilter = {},
  ): Promise<PaginatedResponse<VisitListItem>> => {
    const params = cleanParams(filters);
    const { data } = await aspidApi.get<
      ApiResponse<PaginatedResponse<VisitListItem>>
    >("/visits", {
      params,
    });
    return data.data;
  },
  getVisitDetail: async (id: number): Promise<VisitItem> => {
    const { data } = await aspidApi.get<ApiResponse<VisitItem>>(
      `/visits/${id}`,
    );
    return data.data;
  },
  update: async (
    id: number,
    update: Partial<VisitCreateDto>,
  ): Promise<ResponseOperation> => {
    const { data } = await aspidApi.patch<ApiResponse<ResponseOperation>>(
      `/visits/${id}`,
      update,
    );
    return data.data;
  },
  // Eliminado lógico en el backend: la visita deja de aparecer en listados y métricas
  remove: async (id: number): Promise<ResponseOperation> => {
    const { data } = await aspidApi.delete<ApiResponse<ResponseOperation>>(
      `/visits/${id}`,
    );
    return data.data;
  },
};
