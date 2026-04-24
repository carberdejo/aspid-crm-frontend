import { useMutation, useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import {  ClientCreateDto, ClientFilters } from '@/interfaces/client.interface';
import { toast } from 'sonner';
import { ApiErrorResponse,  } from '@/interfaces';

export const useClients = (filters: ClientFilters = {}) => {

  // const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientService.getClients(filters),
    staleTime: 1000 * 60, // 5 minutos
  });

  const createMutation = useMutation({
      mutationFn: (clientData: ClientCreateDto) => clientService.createClient(clientData),
      onSuccess: (newClient) => {
        // queryClient.setQueryData(['clients'], (old: any) => [...old, newClient]);
        toast.success("Registro completado", {
          description: newClient.message || "Cliente creado correctamente",
        });
      },
      onError: (error: ApiErrorResponse) => {
        const backendMessage = error.errors;
        
        const errorMessage = Array.isArray(backendMessage) 
          ? backendMessage.join(", ") 
          : error.message || "Error inesperado en el servidor";
  
        toast.error("Error de validación", {
          description: errorMessage, // Aquí saldrá: "El código de cliente P-001 ya está registrado"
          duration: 5000,
        });
      }
    });

  return {
    // Retornamos la estructura limpia para el componente
    clients:query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Mutation para crear cliente
    createClient: createMutation.mutate,
    isCreating: createMutation.isPending,

  };
};