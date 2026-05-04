// src/hooks/useClientFilters.ts
import { useState, useEffect } from "react";

export function useClientFilters() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Input temporal
  const [debouncedTerm, setDebouncedTerm] = useState(""); // Filtro real

  // Lógica de Debounce unificada
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1); // Reset al buscar
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleReset = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    handleReset,
    hasFilters: searchTerm.length > 0,
  };
}
