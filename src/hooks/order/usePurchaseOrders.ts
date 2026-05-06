import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrderService } from "../../services";
import { toast } from "sonner";
import { ApiErrorResponse, PurchaseOrderFilters } from "@/interfaces";

export const usePurchaseOrders = (filters: PurchaseOrderFilters) => {
  return useQuery({
    queryKey: ["purchase-orders", filters],
    queryFn: () => PurchaseOrderService.findAll(filters),
    staleTime: 60 * 1000,
  });
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
