"use client";

import { use, useCallback, useState } from "react";
import { DataTable } from "@/components";
import { quoteColumns } from "@/components/quote/table/QuoteColumns";
import { useQuotes } from "@/hooks/useQuotes";
import { QuoteFiltersTable } from "@/components/quote/table/QuoteFiltersTable";
import { QuoteFilters } from "@/services/quote.service";
import { useAuthStore } from "@/store";

interface QuotesPageProps {
  params: Promise<{ id: string }>;
}

export default function QuotesPage({ params }: QuotesPageProps) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);
  const { user } = useAuthStore();

  const [queryParams, setQueryParams] = useState<QuoteFilters>({
    departmentId,
    limit: 10,
    offset: 0,
    quoteNumber: "",
    status: undefined,
    type: undefined,
    userId: user?.sub,
  });

  const currentPage =
    Math.floor((queryParams.offset || 0) / (queryParams.limit || 10)) + 1;

  const { quotes, total, isLoading } = useQuotes(queryParams);

  // 3. Función centralizada para actualizar filtros
  const handleFilterChange = useCallback(
    (newFilters: Partial<QuoteFilters>) => {
      setQueryParams((prev) => ({
        ...prev,
        ...newFilters,
        offset: 0, // Resetear a pag 1 siempre que cambie un filtro
      }));
    },
    [],
  );

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      offset: (page - 1) * (prev.limit || 10),
    }));
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">
            Listado de <span className="text-secondary">Cotizaciones</span>
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Gestión técnica y comercial del departamento
          </p>
        </div>
        {/* Aquí podrías poner el QuoteFlowContainer para crear nuevas */}
      </header>

      <DataTable
        columns={quoteColumns}
        data={quotes}
        total={total}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        filters={
          <QuoteFiltersTable
            filters={queryParams}
            onFilterChange={handleFilterChange}
            onClear={() =>
              setQueryParams({ departmentId, limit: 10, offset: 0 })
            }
          />
        }
      />
    </div>
  );
}
