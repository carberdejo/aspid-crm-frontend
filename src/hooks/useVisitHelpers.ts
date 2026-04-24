import { clientService } from "@/services";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// useVisitHelpers.ts
interface UseVisitDataOptions {
  newClientId?: string;  // ID del cliente que acaba de registrarse
}

export const useVisitData = (clientId?: number, options?: UseVisitDataOptions) => {
  const queryClient = useQueryClient();
  const newClientId = options?.newClientId;

  // Siempre traemos clientes al abrir el modal
  const clientsQuery = useQuery({ 
    queryKey: ['clients'], 
    queryFn: () => clientService.getClients({}), 
    staleTime: 1000 * 60 * 5,
  });

  // Contactos DEPENDIENTES: Solo se dispara si hay clientId
  const contactsQuery = useQuery({
    queryKey: ['contacts', clientId],
    queryFn: () => clientService.getContactsByClient(clientId!),
    enabled: !!clientId, 
  });

  // Efecto: Cuando se registra un nuevo cliente, invalidamos la caché
  // para que la próxima búsqueda traiga el cliente actualizado
  useEffect(() => {
    if (newClientId) {
      // Invalidar caché de clientes para que se recargue en la siguiente request
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  }, [newClientId, queryClient]);

  return {
    clients: clientsQuery.data?.items ?? [],
    contacts: contactsQuery.data ?? [],
    isLoadingClients: clientsQuery.isLoading,
    isLoadingContacts: contactsQuery.isFetching,
    clientsError: clientsQuery.error,
    contactsError: contactsQuery.error,
  };
};