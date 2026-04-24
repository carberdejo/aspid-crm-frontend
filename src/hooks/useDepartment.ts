import { DepartmentService } from "@/services";
import { useQuery } from "@tanstack/react-query"
import { Department } from "@/interfaces";

export const useDepartment = () => {

    const useQueryDeparments = useQuery({
        queryKey: ['departments'],
        queryFn: DepartmentService.getDepartments,
        staleTime: Infinity, // Los departamentos no cambian frecuentemente, así que los mantenemos frescos indefinidamente
    });

  return {
    useQueryDeparments
  }
}

export const useDepartments = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['departments'],
        queryFn: DepartmentService.getDepartments,
        staleTime: Infinity,
    });

    return {
        departments: (data as Department[]) || [],
        isLoading,
        isError,
        error,
    };
};
