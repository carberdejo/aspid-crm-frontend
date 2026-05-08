// src/hooks/useVisitFilters.ts
import { useState, useMemo } from "react";
import { VisitFilter } from "@/interfaces/visit.interface";

interface QueryFiltersState {
  startDate?: string;
  endDate?: string;
  limit: number;
}
// src/hooks/useVisitFilters.ts
export function useVisitFilters(
  initialDeptId?: number,
  initialUserId?: number,
) {
  // avoid synchronous state updates in effects
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [queryFilters, setQueryFilters] = useState<QueryFiltersState>({
    startDate: undefined,
    endDate: undefined,
    limit: 10,
  });

  const filters = useMemo<VisitFilter>(
    () => ({
      ...queryFilters,
      departmentId: initialDeptId,
      userId: initialUserId, // Viene directo del store de Zustand
      term: searchTerm,
      offset: (page - 1) * queryFilters.limit,
    }),
    [queryFilters, initialDeptId, initialUserId, searchTerm, page],
  );

  const handleDateChange = (dates: {
    startDate?: string;
    endDate?: string;
  }) => {
    const sanitizedDates = {
      startDate: dates.startDate || undefined,
      endDate: dates.endDate || undefined,
    };
    setQueryFilters((prev) => ({
      ...prev,
      ...sanitizedDates, // Aquí sobreescribimos ambos valores con lo que venga del componente
    }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setSearchTerm("");
    setQueryFilters({
      startDate: undefined,
      endDate: undefined,
      limit: 10,
    });
    setPage(1);
  };

  const hasFilters =
    searchTerm.length > 0 || !!filters.startDate || !!filters.endDate;

  return {
    // Estados para el UI
    page,
    searchTerm,
    setSearchTerm,
    // Objeto final para la API (React Query lo usará como dependencia)
    filters,
    // Métodos
    handleDateChange,
    handlePageChange,
    handleReset,
    // Helpers de UI
    hasFilters,
  };
}
