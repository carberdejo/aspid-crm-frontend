import { useQuery } from "@tanstack/react-query";
import { MetricsFilters, VisitStatsResponse } from "@/interfaces";
import { analyticsService } from "@/services";
import { DateFilterType } from "@/lib";

export const useVisitStats = (
  filters: MetricsFilters,
  filter: DateFilterType,
  options?: { enabled?: boolean },
) => {
  const { data, isLoading, isError, error, refetch } =
    useQuery<VisitStatsResponse>({
      queryKey: ["visit-stats", { ...filters, filter }],
      queryFn: () => analyticsService.getVisitStats(filters, filter),
      enabled: options?.enabled ?? true,
      staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    });

  return {
    stats: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};
