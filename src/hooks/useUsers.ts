import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UserFilters } from '@/services/user.service';
import type { ApiErrorResponse, User } from '@/interfaces/api.interface';
import { UserCreateDto } from '@/interfaces';
import { toast } from 'sonner';

/**
 * Hook para gestión de usuarios con filtros dinámicos
 */
export const useUsers = (filters: UserFilters = {}) => {
  const queryClient = useQueryClient();

  // Query principal con filtros - La key DEBE incluir filters para refetch automático
  const query = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 60 * 1000, // 1 minuto
  });

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: (userData: UserCreateDto) => userService.create(userData),
    onSuccess: (serverMessage: string) => {
      // Invalida la query para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Lanzar el toast con el mensaje del servidor
      toast.success("Registro completado", {
        description: serverMessage || "Usuario creado correctamente",
      });
    },
    onError: (error: ApiErrorResponse) => {
      const backendMessage = error.errors;
      
      // 2. Si el mensaje es un array (validación múltiple), lo unimos, si no, lo mostramos tal cual
      const errorMessage = Array.isArray(backendMessage) 
        ? backendMessage.join(", ") 
        : error.message || "Error inesperado en el servidor";

      // 3. Mostramos el error específico en el toast
      toast.error("Error de validación", {
        description: errorMessage, // Aquí saldrá: "El código de usuario P-001 ya está registrado"
        duration: 5000,
      });
    }
  });

  // Mutation para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: ({ codUser, data }: { codUser: number; data: Partial<User> }) =>
      userService.update(codUser, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutation para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: (codUser: number) => userService.delete(codUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    // Query data
    users: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    
    // Mutations
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

/**
 * Hook para obtener un usuario específico por código
 */
export const useUserDetail = (codUser: number) => {
  return useQuery({
    queryKey: ['user', codUser],
    queryFn: () => userService.getById(codUser),
    staleTime: 60 * 1000,
    enabled: !!codUser, // Solo ejecutar si hay codUser
  });
};

