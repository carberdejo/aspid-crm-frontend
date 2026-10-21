import {
  AnnulDocumentDto,
  ApiErrorResponse,
  InvoiceQuery,
  UpdateInvoiceDto,
} from "@/interfaces";
import { invoiceService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInvoices = (
  filters: InvoiceQuery,
  options?: { enabled?: boolean },
) => {
  const query = useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => invoiceService.getInvoices(filters),
    staleTime: 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  return {
    invoices: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: invoiceService.create,
    onSuccess: (newInvoice) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] }); // Para actualizar el estado de facturación en las órdenes
      toast.success(newInvoice.message || "Factura creada correctamente");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al crear factura");
    },
  });
  return {
    createInvoice: query.mutate,
    isCreating: query.isPending,
  };
};

const getErrorMessage = (error: ApiErrorResponse, fallback: string) =>
  Array.isArray(error.errors) && error.errors.length
    ? error.errors.join(", ")
    : error.message || fallback;

// Editar o anular una factura cambia lo facturado de su OC
const invalidateBilling = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["invoices"] });
  queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceDto }) =>
      invoiceService.update(id, data),
    onSuccess: (response) => {
      invalidateBilling(queryClient);
      toast.success(response.message || "Factura actualizada");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(getErrorMessage(error, "Error al actualizar la factura"));
    },
  });
};

export const useAnnulInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnnulDocumentDto }) =>
      invoiceService.annul(id, data),
    onSuccess: (response) => {
      invalidateBilling(queryClient);
      toast.success(response.message || "Factura anulada");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(getErrorMessage(error, "Error al anular la factura"));
    },
  });
};
