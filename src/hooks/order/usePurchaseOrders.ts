import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrderService } from "../../services";
import { toast } from "sonner";
import {
  AnnulDocumentDto,
  ApiErrorResponse,
  PurchaseOrderFilters,
  UpdatePurchaseOrderDto,
} from "@/interfaces";

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

const getErrorMessage = (error: ApiErrorResponse, fallback: string) =>
  Array.isArray(error.errors) && error.errors.length
    ? error.errors.join(", ")
    : error.message || fallback;

export const useUpdatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePurchaseOrderDto }) =>
      PurchaseOrderService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success(response.message || "Orden de Compra actualizada");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(getErrorMessage(error, "Error al actualizar la OC"));
    },
  });
};

export const useAnnulPurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnnulDocumentDto }) =>
      PurchaseOrderService.annul(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      // La cotización vuelve a PENDIENTE: se puede registrar otra OC
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quote"] });
      toast.success(response.message || "Orden de Compra anulada");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(getErrorMessage(error, "Error al anular la OC"));
    },
  });
};
