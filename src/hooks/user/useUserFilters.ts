// src/hooks/useUserFilters.ts
import { useState, useEffect } from "react";
import { UserFilters } from "@/interfaces";

export function useUserFilters() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Input de texto real-time

  const [filters, setFilters] = useState<UserFilters>({
    term: "",
    departmentId: undefined,
    isActive: undefined,
  });

  // Debounce para el término de búsqueda (Nombre/Código)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, term: searchTerm }));
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof UserFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({ term: "", departmentId: undefined, isActive: undefined });
    setCurrentPage(1);
  };

  const hasFilters =
    searchTerm !== "" ||
    filters.departmentId !== undefined ||
    filters.isActive !== undefined;

  return {
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
    hasFilters,
  };
}
