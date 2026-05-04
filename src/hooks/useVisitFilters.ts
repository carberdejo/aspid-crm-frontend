// src/hooks/useVisitFilters.ts
import { useState, useEffect } from "react";
import { VisitFilter } from "@/interfaces/visit.interface";

// src/hooks/useVisitFilters.ts
export function useVisitFilters(initialDeptId: number) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState<VisitFilter>({
    departmentId: initialDeptId,
    term: "",
    startDate: undefined,
    endDate: undefined,
    offset: 0,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, term: searchTerm, offset: 0 }));
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDateChange = (
    type: "startDate" | "endDate",
    value: string | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [type]: value, offset: 0 }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters((prev) => ({ ...prev, offset: (newPage - 1) * prev.limit! }));
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      departmentId: initialDeptId,
      term: "",
      startDate: undefined,
      endDate: undefined,
      offset: 0,
      limit: 10,
    });
    setPage(1);
  };

  const hasFilters =
    searchTerm.length > 0 || !!filters.startDate || !!filters.endDate;

  return {
    page,
    searchTerm,
    setSearchTerm,
    filters,
    handleDateChange,
    handlePageChange,
    handleReset,
    hasFilters,
  };
}
