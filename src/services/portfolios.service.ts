import { aspidApi } from "@/api/aspidApi";
import {
  ApiResponse,
  PaginatedResponse,
  ResponseOperation,
} from "@/interfaces";
import {
  Portfolio,
  PortfolioCreateDto,
  PortfolioQuery,
  PortfolioUpdateDto,
} from "@/interfaces/portfolio.interface";

export const portfoliosService = {
  // El que usará el form de clientes (cambia según rol)
  getPortfolios: async (
    query: PortfolioQuery,
  ): Promise<PaginatedResponse<Portfolio>> => {
    const { data } = await aspidApi.get<
      ApiResponse<PaginatedResponse<Portfolio>>
    >(`/portfolios`, { params: query });
    return data.data;
  },

  // Los que usarás después para el CRUD del Admin
  create: async (data: PortfolioCreateDto): Promise<ResponseOperation> => {
    const { data: response } = await aspidApi.post<
      ApiResponse<ResponseOperation>
    >(`/portfolios`, data);
    return response.data;
  },

  update: async (
    id: string,
    data: PortfolioUpdateDto,
  ): Promise<ResponseOperation> => {
    const { data: response } = await aspidApi.patch<
      ApiResponse<ResponseOperation>
    >(`/portfolios/${id}`, data);
    return response.data;
  },

  deactivate: async (id: string): Promise<ResponseOperation> => {
    const { data: response } = await aspidApi.patch<
      ApiResponse<ResponseOperation>
    >(`/portfolios/${id}/deactivate`, {});
    return response.data;
  },
};
