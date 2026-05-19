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

export const industrySegmentsService = {
  // El que usará el form de clientes
  getindustrySegments: async (
    query: industrySegmentsQuery,
  ): Promise<PaginatedResponse<IndustrySegment>> => {
    const { data } = await concarApi.get<
      ApiResponse<PaginatedResponse<IndustrySegment>>
    >(`/catalogs/segments`, { params: query });
    return data.data;
  },

  create: async (data: IndustrySegmentCreateDto) => {
    const response = await concarApi.post<ApiResponse<IndustrySegment>>(
      `/catalogs/segments`,
      data,
    );
    return response.data;
  },

  update: async (id: string, data: IndustrySegmentUpdateDto) => {
    const response = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/catalogs/segments/${id}`,
      data,
    );
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/catalogs/segments/${id}/deactivate`,
    );
    return response.data;
  },
  reactivate: async (id: string) => {
    const response = await concarApi.patch<ApiResponse<ResponseOperation>>(
      `/catalogs/segments/${id}/reactivate`,
    );
    return response.data;
  },
};
