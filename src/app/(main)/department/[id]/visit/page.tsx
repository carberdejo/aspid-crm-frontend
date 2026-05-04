"use client";

import { use } from "react";
import { useVisits } from "@/hooks/useVisits";
import { useVisitFilters } from "@/hooks/useVisitFilters"; // Nuevo Hook
import { DataTable } from "@/components";
import { visitColumns } from "@/components/visit/table/VisitColumns";
import { VisitRowDetails } from "@/components/visit/table/VisitRowDetails";
import { VisitToolbar } from "@/components/visit/table/VisitToolbar";

interface VisitasPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitasPage({ params }: VisitasPageProps) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);

  // 1. Lógica delegada al Hook personalizado
  const {
    page,
    searchTerm,
    setSearchTerm,
    filters,
    handlePageChange,
    handleReset,
    hasFilters,
    handleDateChange,
  } = useVisitFilters(departmentId);

  // 2. Fetch de datos
  const { visits, total, isLoading } = useVisits(filters);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-primary uppercase tracking-tighter">
            Listado de <span className="text-secondary">Visitas</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
            Gestión técnica y comercial ({total})
          </p>
        </div>
      </div>

      {/* Tabla con Toolbar integrado */}
      <DataTable
        columns={visitColumns}
        data={visits}
        total={total}
        isLoading={isLoading}
        currentPage={page}
        onPageChange={handlePageChange}
        renderSubComponent={VisitRowDetails}
        filters={
          <VisitToolbar
            searchValue={searchTerm}
            onSearch={setSearchTerm}
            startDate={filters.startDate?.toString()}
            endDate={filters.endDate?.toString()}
            onDateChange={handleDateChange}
            onReset={handleReset}
            hasFilters={hasFilters}
          />
        }
      />
    </div>
  );
}
