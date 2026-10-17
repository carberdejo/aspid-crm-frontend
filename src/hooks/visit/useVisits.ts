import { ApiErrorResponse } from "@/interfaces";
import { VisitCreateDto, VisitFilter } from "@/interfaces/visit.interface";
import { VisitService } from "@/services/visit.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVisits = (
  filters: VisitFilter = {},
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient();

  const queryVisits = useQuery({
    queryKey: ["visits", filters],
    queryFn: () => VisitService.getVisits(filters),
    staleTime: 60 * 1000, // 1 minuto
    enabled: options?.enabled ?? true,
  });

  const useCreateVisits = () =>
    useMutation({
      mutationFn: (visitData: VisitCreateDto) => {
        // Validar que los campos requeridos estén presentes
        if (!visitData.userId) {
          throw new Error("userId es requerido");
        }
        if (!visitData.clientId) {
          throw new Error("clientId es requerido");
        }
        if (!visitData.contactId) {
          throw new Error("contactId es requerido");
        }
        if (!visitData.departmentId) {
          throw new Error("departmentId es requerido");
        }

        return VisitService.create(visitData);
      },
      onSuccess: (response) => {
        // Invalidar queries relevantes para refetch
        queryClient.invalidateQueries({ queryKey: ["visits"] });

        toast.success("Visita registrada", {
          description:
            response.message || "La visita se ha registrado correctamente",
        });
      },
      onError: (error: ApiErrorResponse) => {
        const backendMessage = error.errors;
        const errorMessage = Array.isArray(backendMessage)
          ? backendMessage.join(", ")
          : error.message || "Error inesperado en el servidor";

        toast.error("Error al registrar visita", {
          description: errorMessage,
          duration: 5000,
        });
      },
    });

  return {
    useCreateVisits,

    visits: queryVisits.data?.items || [],
    total: queryVisits.data?.total || 0,
    isLoading: queryVisits.isLoading,
    isError: queryVisits.isError,
    refetch: queryVisits.refetch,
  };
};

export const useVisitDetail = (id?: number) => {
  return useQuery({
    queryKey: ["visit-detail", id],
    queryFn: () => VisitService.getVisitDetail(id!),
    staleTime: 60 * 1000,
    enabled: !!id,
  });
};

const getErrorMessage = (error: ApiErrorResponse) =>
  Array.isArray(error.errors) && error.errors.length
    ? error.errors.join(", ")
    : error.message || "Error inesperado en el servidor";

// Tras editar o eliminar se refrescan el listado, el detalle y las métricas de visitas
const invalidateVisitQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
) => {
  queryClient.invalidateQueries({ queryKey: ["visits"] });
  queryClient.invalidateQueries({ queryKey: ["visit-detail", id] });
  queryClient.invalidateQueries({ queryKey: ["visit-stats"] });
};

export const useUpdateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VisitCreateDto> }) =>
      VisitService.update(id, data),
    onSuccess: (response, { id }) => {
      invalidateVisitQueries(queryClient, id);
      toast.success("Visita actualizada", { description: response.message });
    },
    onError: (error: ApiErrorResponse) => {
      toast.error("Error al actualizar visita", {
        description: getErrorMessage(error),
        duration: 5000,
      });
    },
  });
};

export const useDeleteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VisitService.remove(id),
    onSuccess: (response, id) => {
      invalidateVisitQueries(queryClient, id);
      toast.success("Visita eliminada", { description: response.message });
    },
    onError: (error: ApiErrorResponse) => {
      toast.error("Error al eliminar visita", {
        description: getErrorMessage(error),
        duration: 5000,
      });
    },
  });
};

export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitData: VisitCreateDto) => {
      // Tu lógica de validaciones previas...
      return VisitService.create(visitData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      toast.success("Visita registrada", { description: response.message });
    },
    onError: (error: ApiErrorResponse) => {
      // Tu lógica de manejo de errores...
      toast.error("Error al registrar visita", { description: error.message });
    },
  });
};
