import { ApiErrorResponse, InvoiceQuery } from "@/interfaces";
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
