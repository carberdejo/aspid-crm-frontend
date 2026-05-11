import { clientService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { contactQueryKeys, clientQueryKeys } from "@/lib/queryKeys";

export const useContactsByClient = (id: number) => {
  const useQueryContact = useQuery({
    queryKey: contactQueryKeys.byClient(id),
    queryFn: () => clientService.getContactsByClient(id),
    staleTime: 60 * 1000, // 1 minuto
    enabled: id !== null && id !== undefined && id > 0, // Solo se ejecuta si hay un ID válido
  });

  return {
    contact: useQueryContact,
  };
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.createContact,
    onSuccess: (response) => {
      console.log({ data: response }); // Verifica qué datos estás recibiendo del servicio
      // Invalida la lista de contactos de ese cliente específico
      queryClient.invalidateQueries({
        queryKey: contactQueryKeys.byClient(+response.item.clientId),
      });
      // Invalida la lista de clientes para que el contador de contactos se actualice
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.all });
      toast.success("Contacto registrado exitosamente");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data?.message || "Error al registrar contacto",
      );
    },
  });
};
