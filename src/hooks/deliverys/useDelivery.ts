import {
  ApiErrorResponse,
  DeliveryCreateDto,
  PurchaseOrderFilters,
} from "@/interfaces";
import { deliveryService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDelivery = (filters: Partial<PurchaseOrderFilters> = {}) => {
  const query = useQuery({
    // Los filtros forman parte de la clave: cambiar de página o de área vuelve a consultar
    queryKey: ["deliverys", filters],
    queryFn: () => deliveryService.getDeliverys(filters),
    staleTime: 1000 * 60, // 1 minuto
  });
  return {
    deliverys: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCreateDelivery = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: DeliveryCreateDto) =>
      deliveryService.createDelivery(data),
    onSuccess: (response) => {
      toast.success("Entrega creada", {
        description:
          response.message || "La entrega se ha creado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["deliverys"] });
    },
    onError: (error: ApiErrorResponse) => {
      const backendMessage = error.errors;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : error.message || "Error inesperado en el servidor";

      toast.error("Error al crear entrega", {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
  return {
    createDelivery: mutation.mutate,
    isCreating: mutation.isPending,
  };
};
