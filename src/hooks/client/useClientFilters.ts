// src/hooks/client/useClientFilters.ts
import { useState, useMemo, useEffect } from "react";

export function useClientFilters(pageSize: number = 10) {
  // 1. Estado independiente para la página
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // 2. Debounce simple solo para el término (no toca el offset aquí)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1); // Si el usuario escribe algo nuevo, lo regresamos a la pag 1
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. El objeto 'filters' se construye dinámicamente, igual que en PurchaseOrders
  const filters = useMemo(
    () => ({
      term: debouncedTerm,
      limit: pageSize,
      offset: (page - 1) * pageSize, // ¡Aquí está la magia que faltaba!
    }),
    [debouncedTerm, page, pageSize],
  );

  // 4. Reset general
  const handleReset = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setPage(1);
  };

  return {
    // Exponemos setPage directamente para que la DataTable lo use
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    hasFilters: searchTerm.length > 0,
  };
}
