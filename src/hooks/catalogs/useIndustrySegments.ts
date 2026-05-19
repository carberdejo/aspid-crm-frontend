import { ApiErrorResponse } from "@/interfaces";
import {
  industrySegmentsQuery,
  IndustrySegmentUpdateDto,
} from "@/interfaces/industry-segment.interface";
import { industrySegmentsService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIndustrySegments = (filters: industrySegmentsQuery) => {
  const query = useQuery({
    queryKey: ["industry-segments"],
    queryFn: () => industrySegmentsService.getindustrySegments(filters),
    staleTime: Infinity, // Los segmentos de industria no cambian frecuentemente, así que los mantenemos frescos indefinidamente
  });
  return {
    industrySegments: query.data?.items || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useCreateIndustrySegment = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: industrySegmentsService.create,
    onSuccess: (newSegment) => {
      queryClient.invalidateQueries({ queryKey: ["industry-segments"] });
      toast.success(
        newSegment.message || "Segmento de industria creado correctamente",
      );
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al crear segmento");
    },
  });
  return {
    createSegment: query.mutate,
    isCreating: query.isPending,
  };
};

export const useUpdateIndustrySegment = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: IndustrySegmentUpdateDto;
    }) => industrySegmentsService.update(id, data),
    onSuccess: (updatedSegment) => {
      queryClient.invalidateQueries({ queryKey: ["industry-segments"] });
      toast.success(
        updatedSegment.message ||
          "Segmento de industria actualizado correctamente",
      );
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al actualizar segmento");
    },
  });
  return {
    updateSegment: query.mutate,
    isUpdating: query.isPending,
  };
};

export const useToggleIndustrySegmentStatus = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive
        ? industrySegmentsService.deactivate(id)
        : industrySegmentsService.reactivate(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["industry-segments"] });
      toast.success(response.message || "Segmento de industria actualizado");
    },
    onError: (error: ApiErrorResponse) => {
      toast.error(error.message || "Error al actualizar segmento");
    },
  });
  return {
    toggleStatus: query.mutate,
    isToggling: query.isPending,
  };
};
