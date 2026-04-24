import { ApiErrorResponse } from "@/interfaces";
import { VisitCreateDto, VisitFilter } from "@/interfaces/visit.interface"
import { VisitService } from "@/services/visit.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const useVisits = (filters: VisitFilter = {}, id?:number) => {
    const queryClient = useQueryClient();

    const queryVisits = useQuery({
        queryKey: ['visits',filters],
        queryFn: () => VisitService.getVisits(filters),
        staleTime: 60 * 1000, // 1 minuto
    });

    const queryVisitDetail = useQuery({
        queryKey: ['visit-detail', id],
        queryFn: () => VisitService.getVisitDetail(id!),
        staleTime: 60 * 1000, // 1 minuto
        enabled: !!id // Solo se ejecuta si hay un ID válido
    });
 
    const useCreateVisits = () => useMutation({
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
            queryClient.invalidateQueries({ queryKey: ['visits'] });
            
            toast.success("Visita registrada", {
                description: response.message || "La visita se ha registrado correctamente",
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
        }
    });

    return {
        useCreateVisits,
        
        visitDetail: queryVisitDetail.data,
        visitDetailLoading: queryVisitDetail.isLoading,

        visits: queryVisits.data?.items || [],
        total: queryVisits.data?.total || 0,
        isLoading: queryVisits.isLoading,
        isError: queryVisits.isError,
        refetch: queryVisits.refetch
    }
};