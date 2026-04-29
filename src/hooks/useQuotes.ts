import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quoteService, type QuoteFilters } from "@/services/quote.service";
import type {
  ApiErrorResponse,
  QuoteCreateDto,
  QuoteDetail,
} from "@/interfaces";
import { toast } from "sonner";

/**
 * Función auxiliar para manejar los errores del backend formateados por nuestro ExceptionFilter
 */
const handleBackendError = (error: any, title: string) => {
  const apiError = error.response?.data as ApiErrorResponse;
  const description = Array.isArray(apiError?.errors)
    ? apiError.errors.join(", ")
    : apiError?.message || "Error inesperado en el servidor";

  toast.error(title, { description, duration: 5000 });
};

export const useQuotes = (filters: QuoteFilters = {}) => {
  const queryClient = useQueryClient();

  // 1. Listado de cotizaciones
  const query = useQuery({
    queryKey: ["quotes", filters],
    queryFn: () => quoteService.getQuotes(filters),
    staleTime: 60 * 1000, // 1 minuto
  });

  // 2. Crear cotización
  const createMutation = useMutation({
    mutationFn: (quoteData: QuoteCreateDto) => quoteService.create(quoteData),
    onSuccess: (newQuote) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Registro exitoso", {
        description: newQuote || "Cotización creada correctamente",
      });
    },
    onError: (error) => handleBackendError(error, "Error al crear cotización"),
  });

  // 3. Actualizar cotización
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<QuoteCreateDto> }) =>
      quoteService.update(id, data),
    onSuccess: (updatedQuote: QuoteDetail) => {
      // Invalidamos la lista y el detalle específico
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      queryClient.invalidateQueries({ queryKey: ["quote", updatedQuote.id] });

      toast.success("Actualizado", {
        description: "La cotización se actualizó correctamente",
      });
    },
    onError: (error) => handleBackendError(error, "Error al actualizar"),
  });

  // 4. Rechazar/Eliminar (Soft Delete)
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      quoteService.remove(id, reason),
    onSuccess: (message: string) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Cotización rechazada", { description: message });
    },
    onError: (error) => handleBackendError(error, "Error al procesar rechazo"),
  });

  return {
    // Data
    quotes: query.data?.items || [],
    total: query.data?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,

    // Acciones
    createQuote: createMutation.mutateAsync, // Usamos mutateAsync por si quieres manejar el loading en el botón
    updateQuote: updateMutation.mutate,
    rejectQuote: rejectMutation.mutate,

    // Estados de carga
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};

/**
 * Hook para el detalle de una cotización
 */
export const useQuoteDetail = (id?: number) => {
  return useQuery({
    queryKey: ["quote", id],
    queryFn: () => quoteService.getById(id!),
    enabled: !!id, // Solo se ejecuta si el ID existe
    staleTime: 5 * 60 * 1000, // El detalle puede vivir 5 min en caché
  });
};
