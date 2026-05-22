// src/hooks/segment/useSegmentFilters.ts
import { useState, useMemo, useEffect } from "react";

export function useSegmentFilters(pageSize: number = 10) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setPage(1);
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
