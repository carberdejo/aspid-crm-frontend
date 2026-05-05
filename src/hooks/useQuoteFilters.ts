// src/hooks/useQuoteFilters.ts
import { useState, useMemo } from "react";
import { QuoteFilters } from "@/services/quote.service";

export function useQuoteFilters(departmentId: number, userId?: number) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [queryFilters, setQueryFilters] = useState<Partial<QuoteFilters>>({
    status: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    limit: 10,
  });

  // Filtro unificado (Estado Derivado)
  const filters = useMemo<QuoteFilters>(
    () => ({
      ...queryFilters,
      departmentId,
      userId, // Viene del store de Zustand
      term: searchTerm,
      offset: (page - 1) * (queryFilters.limit || 10),
    }),
    [queryFilters, departmentId, userId, searchTerm, page],
  );

  const handleFilterChange = (newFilters: Partial<QuoteFilters>) => {
    setQueryFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setQueryFilters({ limit: 10 });
    setPage(1);
  };

  return {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
    hasFilters:
      searchTerm.length > 0 ||
      Object.values(queryFilters).some((v) => v !== undefined && v !== 10),
  };
}
