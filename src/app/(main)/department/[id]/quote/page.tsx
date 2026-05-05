// src/app/dashboard/quotes/page.tsx
"use client";

import { use } from "react";
import { FileText } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components";
import { quoteColumns } from "@/components/quote/table/QuoteColumns";
import { useQuotes } from "@/hooks/useQuotes";
import { useQuoteFilters } from "@/hooks/useQuoteFilters"; // Hook nuevo
import { QuoteFiltersTable } from "@/components/quote/table/QuoteFiltersTable";
import { useAuthStore } from "@/store";

export default function QuotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);

  // Extraemos el ID con selector para eficiencia
  const userId = useAuthStore((state) => state.user?.sub);

  // Lógica de filtros delegada
  const {
    page,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
  } = useQuoteFilters(departmentId, userId);

  // Fetch de datos (Solo se activa si hay userId para evitar duplicados en carga)
  const { quotes, total, isLoading } = useQuotes(filters, {
    enabled: !!userId,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Cotizaciones"
        subtitle="Control de presupuestos y ofertas comerciales"
        icon={FileText}
        iconColor="accent"
        count={total}
        countLabel="cotizaciones"
      />

      <DataTable
        columns={quoteColumns}
        data={quotes}
        total={total}
        currentPage={page}
        onPageChange={(p) =>
          handleFilterChange({ offset: (p - 1) * (filters.limit || 10) })
        }
        isLoading={isLoading}
        filters={
          <QuoteFiltersTable
            filters={filters}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterChange={handleFilterChange}
            onClear={handleReset}
          />
        }
      />
    </div>
  );
}
