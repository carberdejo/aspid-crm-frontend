import { DepartmentService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useDepartment = () => {
  const useQueryDeparments = useQuery({
    queryKey: ["departments"],
    queryFn: DepartmentService.getDepartments,
    staleTime: Infinity, // Los departamentos no cambian frecuentemente, así que los mantenemos frescos indefinidamente
  });

  return {
    useQueryDeparments,
  };
};

export const useDepartments = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: DepartmentService.getDepartments,
    staleTime: Infinity,
  });

  return {
    departments: data?.items || [],
    total: data?.total || 0,
    offset: data?.offset || 0,
    limit: data?.limit || 0,
    isLoading,
    isError,
    error,
  };
};

/** Usuarios activos del área, para elegir responsable o colaborador */
export const useDepartmentMembers = (departmentId: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["departments", departmentId, "members"],
    queryFn: () => DepartmentService.getMembers(departmentId),
    enabled: departmentId > 0,
    staleTime: 1000 * 60 * 5,
  });

  return { members: data ?? [], isLoading };
};
