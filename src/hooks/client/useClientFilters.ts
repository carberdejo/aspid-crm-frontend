import { useState, useMemo, useEffect } from "react";

// Define la interfaz de los filtros si no la tienes en tus interfaces globales
export interface ClientFilters {
  term?: string;
  portfolioId?: number;
  segmentId?: number;
  limit?: number;
  offset?: number;
}

export function useClientFilters(pageSize: number = 10) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const [queryFilters, setQueryFilters] = useState<Partial<ClientFilters>>({
    portfolioId: undefined,
    segmentId: undefined,
    limit: pageSize,
  });

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtro unificado para el backend
  const filters = useMemo<ClientFilters>(
    () => ({
      ...queryFilters,
      term: debouncedTerm,
      offset: (page - 1) * (queryFilters.limit || 10),
    }),
    [queryFilters, debouncedTerm, page],
  );

  const handleFilterChange = (newFilters: Partial<ClientFilters>) => {
    setQueryFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Siempre volver a la página 1 al cambiar un filtro
  };

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setQueryFilters({ limit: pageSize });
    setPage(1);
  };

  const hasFilters =
    searchTerm.length > 0 ||
    queryFilters.portfolioId !== undefined ||
    queryFilters.segmentId !== undefined;

  return {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
    hasFilters,
  };
}
