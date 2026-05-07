import { useQuery } from "@tanstack/react-query";
import { VisitMetricsQueryDto, VisitStatsResponse } from "@/interfaces";
import { analyticsService } from "@/services";
import { DateFilterType } from "@/lib";

export const useVisitStats = (userId: number, filter: DateFilterType) => {
  const { data, isLoading, isError, error, refetch } =
    useQuery<VisitStatsResponse>({
      queryKey: ["visit-stats", { userId, filter }],
      queryFn: () => analyticsService.getVisitStats(userId, filter),
      // Solo se ejecuta si tenemos rango de fechas (ajusta según tu necesidad)
      //   enabled: !!startDate && !!endDate,
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
