import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quoteService, type QuoteFilters } from "@/services/quote.service";
import type {
  ApiErrorResponse,
  QuoteCreateDto,
  QuoteDelete,
  QuoteDetail,
} from "@/interfaces";
import { toast } from "sonner";

/**
 * Función auxiliar para manejar los errores del backend formateados por nuestro ExceptionFilter
 */
const handleBackendError = (error: unknown, title: string) => {
  const apiError =
    typeof error === "object" && error !== null && "response" in error
      ? ((error as { response?: { data?: ApiErrorResponse } }).response
          ?.data as ApiErrorResponse)
      : undefined;

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
    },
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
    },
  });

  // 4. Rechazar/Eliminar (Soft Delete)
  const deleteMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: QuoteDelete }) =>
      quoteService.remove(id, reason),
    onSuccess: (message: string) => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Cotización rechazada", { description: message });
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
    },
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
    rejectQuote: deleteMutation.mutate,

    // Estados de carga
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRejecting: deleteMutation.isPending,
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
    staleTime: 60 * 1000, // El detalle puede vivir 1 min en caché
  });
};
