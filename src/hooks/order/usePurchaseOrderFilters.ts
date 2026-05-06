import { PurchaseOrderFilters, SortOrder } from "@/interfaces";
import { useState, useMemo, useCallback } from "react";

export function usePurchaseOrderFilters() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [queryFilters, setQueryFilters] = useState<
    Partial<PurchaseOrderFilters>
  >({
    order: SortOrder.DESC,
    limit: 10,
    startDate: undefined,
    endDate: undefined,
  });

  const filters = useMemo<PurchaseOrderFilters>(
    () => ({
      ...queryFilters,
      term: searchTerm,
      offset: (page - 1) * (queryFilters.limit || 10),
    }),
    [queryFilters, searchTerm, page],
  );

  const handleReset = () => {
    setSearchTerm("");
    setQueryFilters({
      order: SortOrder.DESC,
      limit: 10,
      startDate: undefined,
      endDate: undefined,
    });
    setPage(1);
  };

  const handleFilterChange = useCallback(
    (newFilters: Partial<PurchaseOrderFilters>) => {
      setQueryFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
      setPage(1); // Reset fundamental
    },
    [],
  );

  return {
    // Estados de control
    page,
    setPage,
    searchTerm,
    setSearchTerm,

    //Objeto de filtros final que se envía al backend
    filters,
    // Métodos de actualización
    handleReset,
    handleFilterChange,
    // Helper para saber si hay filtros activos
    hasFilters:
      searchTerm.length > 0 ||
      queryFilters.order !== "DESC" ||
      !!queryFilters.startDate ||
      !!queryFilters.endDate,
  };
}
