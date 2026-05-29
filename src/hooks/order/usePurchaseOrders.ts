import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrderService } from "../../services";
import { toast } from "sonner";
import { ApiErrorResponse, PurchaseOrderFilters } from "@/interfaces";

export const usePurchaseOrders = (
  filters: PurchaseOrderFilters,
  options?: { enabled?: boolean },
) => {
  const query = useQuery({
    queryKey: ["purchase-orders", filters],
    queryFn: () => PurchaseOrderService.findAll(filters),
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  return {
    orders: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PurchaseOrderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["quotes"] }); // Invalida quotes porque su status cambia
      toast.success("Orden de Compra registrada y Cotización aprobada");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al registrar PO");
    },
  });
};
