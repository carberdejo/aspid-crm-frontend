// src/hooks/portfolio/usePortfolioFilters.ts
import { useState, useMemo, useEffect } from "react";

export function usePortfolioFilters(pageSize: number = 10) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Retraso de 500ms para no saturar la API mientras el usuario teclea
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1); // Regresamos a la página 1 al buscar algo nuevo
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filters = useMemo(
    () => ({
      term: debouncedTerm,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    [debouncedTerm, page, pageSize],
  );

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setPage(1);
  };

  return {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    hasFilters: searchTerm.length > 0,
  };
}
