import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
} from "@/interfaces";
import {
  IndustrySegment,
  IndustrySegmentCreateDto,
  industrySegmentsQuery,
  IndustrySegmentUpdateDto,
} from "@/interfaces/industry-segment.interface";
import { cleanParams } from "@/lib";

export const industrySegmentsService = {
  // El que usará el form de clientes
  getindustrySegments: async (
    query: industrySegmentsQuery,
  ): Promise<PaginatedResponse<IndustrySegment>> => {
    const params = cleanParams(query as Record<string, unknown>);

    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<IndustrySegment>>
    >(`/catalogs/segments`, { params });
    return data.data;
  },

  create: async (data: IndustrySegmentCreateDto) => {
    const { data: responseData } = await concarApi.post<
      ApiResponse<ResponseOperation>
    >(`/catalogs/segments`, data);
    return responseData.data;
  },

  update: async (id: number, data: IndustrySegmentUpdateDto) => {
    const { data: responseData } = await concarApi.patch<
      ApiResponse<ResponseOperation>
    >(`/catalogs/segments/${id}`, data);
    return responseData.data;
  },

  deactivate: async (id: number) => {
    const { data } = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/catalogs/segments/${id}/deactivate`,
    );
    return data.data;
  },
  reactivate: async (id: number) => {
    const { data } = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/catalogs/segments/${id}/reactivate`,
    );
    return data.data;
  },
};
