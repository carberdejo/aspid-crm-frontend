import { concarApi } from "@/api/concarApi";
import {
  ApiResponse,
  PaginatedResponse,
  Quote,
  QuoteCreateDto,
  QuoteDetail,
  QuoteStatus,
  ResponseCreate,
} from "@/interfaces";
import { cleanParams } from "@/lib/utils";

// usamos extends record para permitir filtros dinámicos sin perder la tipificación de los campos específicos
export interface QuoteFilters extends Record<string, unknown> {
  limit?: number;
  offset?: number;
  quoteNumber?: string;
  clientId?: number;
  status?: QuoteStatus;
  startDate?: string;
  endDate?: string;
}

export const quoteService = {
  /**
   * Obtener listado paginado (Versión Lite)
   */
  getQuotes: async (
    filters: QuoteFilters = {},
  ): Promise<PaginatedResponse<Quote>> => {
    const params = cleanParams(filters);

    const { data } = await concarApi.get<ApiResponse<PaginatedResponse<Quote>>>(
      "/quotes",
      { params },
    );
    // Retornamos el objeto que contiene items, total, limit y offset
    return data.data;
  },

  /**
   * Obtener detalle completo de una cotización
   */
  getById: async (id: number): Promise<QuoteDetail> => {
    const { data } = await concarApi.get<ApiResponse<QuoteDetail>>(
      `/quotes/${id}`,
    );
    return data.data;
  },

  /**
   * Crear cotización (Manual Registry)
   * El backend solo responde { message: "..." }
   */
  create: async (quoteData: QuoteCreateDto): Promise<string> => {
    const { data } = await concarApi.post<ApiResponse<ResponseCreate>>(
      "/quotes",
      quoteData,
    );
    return data.message;
  },

  /**
   * Actualizar cotización (Retorna el objeto actualizado para optimizar el Front)
   */
  update: async (
    id: number,
    quoteData: Partial<QuoteCreateDto>,
  ): Promise<QuoteDetail> => {
    const { data } = await concarApi.patch<ApiResponse<QuoteDetail>>(
      `/quotes/${id}`,
      quoteData,
    );
    return data.data;
  },

  /**
   * Rechazar/Eliminar (Soft Delete con motivo)
   */
  remove: async (id: number, statusReason: string): Promise<string> => {
    const { data } = await concarApi.patch<{ message: string }>(
      `/quotes/${id}/reject`,
      {
        statusReason,
      },
    );
    return data.message;
  },
};
