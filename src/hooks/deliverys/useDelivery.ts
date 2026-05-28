import { ApiErrorResponse, DeliveryCreateDto } from "@/interfaces";
import { deliveryService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDelivery = () => {
  const query = useQuery({
    queryKey: ["deliverys"],
    queryFn: deliveryService.getDeliverys,
    staleTime: 1000 * 60, // 5 minutos
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
