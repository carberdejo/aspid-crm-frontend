import { concarApi } from "@/api/concarApi";
import { cleanParams, DateFilterType, getDateRange } from "@/lib/utils";
import { ApiResponse } from "../interfaces";
import {
  MetricsFilters,
  QuotesSummary,
  VisitStatsResponse,
} from "@/interfaces/analytics.interface";

export const analyticsService = {
  getQuotesSummary: async (filters: MetricsFilters, filter: DateFilterType) => {
    const { startDate, endDate } = getDateRange(filter);
    const { data } = await concarApi.get<ApiResponse<QuotesSummary>>(
      `/analytics/quotes-summary`,
      {
        params: cleanParams({ ...filters, startDate, endDate }),
      },
    );
    return data.data; // Retorna { total, pending, approved }
  },
  getVisitStats: async (filters: MetricsFilters, filter: DateFilterType) => {
    const { startDate, endDate } = getDateRange(filter);
    const { data } = await concarApi.get<ApiResponse<VisitStatsResponse>>(
      `/analytics/visits-summary`,
      {
        params: cleanParams({ ...filters, startDate, endDate }),
      },
    );
    return data.data; // Retorna las estadísticas de visitas
  },
};
