import { concarApi } from "@/api/concarApi";
import { DateFilterType, getDateRange } from "@/lib/utils";
import { ApiResponse } from "../interfaces/api.interface";
import { QuotesSummary } from "@/interfaces/analytics.interface";

export const analyticsService = {
  getQuotesSummary: async (userId: number, filter: DateFilterType) => {
    const { startDate, endDate } = getDateRange(filter);
    const { data } = await concarApi.get<ApiResponse<QuotesSummary>>(
      `/analytics/quotes-summary`,
      {
        params: { userId, startDate, endDate },
      },
    );
    return data.data; // Retorna { total, pending, approved }
  },
};
