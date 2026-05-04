import { concarApi } from "@/api/concarApi";
import { ApiResponse, PaginatedResponse, ResponseCreate } from "@/interfaces";
import {
  VisitCreateDto,
  VisitFilter,
  VisitItem,
  VisitListItem,
} from "@/interfaces/visit.interface";
import { cleanParams } from "@/lib/utils";

export const VisitService = {
  create: async (create: VisitCreateDto): Promise<ResponseCreate> => {
    const { data } = await concarApi.post<ApiResponse<ResponseCreate>>(
      "/visits",
      create,
    );
    return data.data;
  },
  getVisits: async (
    filters: VisitFilter = {},
  ): Promise<PaginatedResponse<VisitListItem>> => {
    const params = cleanParams(filters);
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<VisitListItem>>
    >("/visits", {
      params,
    });
    return data.data;
  },
  getVisitDetail: async (id: number): Promise<VisitItem> => {
    const { data } = await concarApi.get<ApiResponse<VisitItem>>(
      `/visits/${id}`,
    );
    return data.data;
  },
};
