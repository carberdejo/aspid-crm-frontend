"use client";

import { use } from "react";
import { FileText, CircleDollarSign, TrendingUp } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { DataTable } from "@/components";
import { quoteColumns } from "@/components/quote/table/QuoteColumns";
import { useQuotes } from "@/hooks/quote/useQuotes";
import { useQuoteFilters } from "@/hooks/quote/useQuoteFilters";
import { QuoteFiltersTable } from "@/components/quote/table/QuoteFiltersTable";
import { useAuthStore } from "@/store";

// Formateador de moneda profesional
const formatUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function QuotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);

  const userId = useAuthStore((state) => state.user?.sub);

  const {
    page,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleReset,
  } = useQuoteFilters(departmentId, userId);

  // Asegúrate de que useQuotes retorne el nuevo campo totalAmountUSD
  const { quotes, total, totalAmountUSD, isLoading } = useQuotes(filters, {
    enabled: !!userId,
  });

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Cotizaciones"
        subtitle="Control de presupuestos y ofertas comerciales"
        icon={FileText}
        themeColor="orange"
        count={total}
        countLabel="cotizaciones"
      />

      {/* --- NUEVO: BARRA DE RESUMEN FINANCIERO --- */}
      {!isLoading && (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CircleDollarSign size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Valor Total
              </p>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                Consolidado en dólares a la tasa de hoy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-3xl font-black text-slate-800 tracking-tight">
              {formatUSD(totalAmountUSD || 0)}
            </span>
          </div>
        </div>
      )}
      {/* ------------------------------------------ */}

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
