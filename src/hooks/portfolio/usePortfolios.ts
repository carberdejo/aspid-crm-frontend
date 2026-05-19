import { ApiErrorResponse } from "@/interfaces";
import {
  PortfolioQuery,
  PortfolioUpdateDto,
} from "@/interfaces/portfolio.interface";
import { portfoliosService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePortfolios = (
  filters: PortfolioQuery,
  //   options?: { enabled?: boolean },
) => {
  const query = useQuery({
    queryKey: ["portfolios", filters],
    queryFn: () => portfoliosService.getPortfolios(filters),
    staleTime: 5 * 60 * 1000,
    // enabled: options?.enabled ?? true,
  });
  return {
    portfolios: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: portfoliosService.create,
    onSuccess: (newPortfolio) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(newPortfolio.message || "Portfolio creado correctamente");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al registrar Portfolio");
    },
  });
  return {
    createPortfolio: query.mutate,
    isCreating: query.isPending,
  };
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PortfolioUpdateDto }) =>
      portfoliosService.update(id, data),
    onSuccess: (updatedPortfolio) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(
        updatedPortfolio.message || "Portfolio actualizado correctamente",
      );
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al actualizar Portfolio");
    },
  });
  return {
    updatePortfolio: query.mutate,
    isUpdating: query.isPending,
  };
};

export const useTogglePortfolioStatus = () => {
  const queryClient = useQueryClient();

  const query = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive
        ? portfoliosService.deactivate(id)
        : portfoliosService.update(id, { isActive: true }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
      toast.success(
        variables.isActive ? "Cartera desactivada" : "Cartera reactivada",
      );
    },
    onError: () => {
      toast.error("Error al cambiar el estado de la cartera");
    },
  });
  return {
    togglePortfolioStatus: query.mutate,
    isToggling: query.isPending,
  };
};
