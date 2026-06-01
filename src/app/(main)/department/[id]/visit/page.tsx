"use client";

import { use } from "react";
import { ClipboardList, MapPin } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useVisits } from "@/hooks/visit/useVisits";
import { useVisitFilters } from "@/hooks/visit/useVisitFilters"; // Nuevo Hook
import { DataTable } from "@/components";
import { visitColumns } from "@/components/visit/table/VisitColumns";
import { VisitRowDetails } from "@/components/visit/table/VisitRowDetails";
import { VisitToolbar } from "@/components/visit/table/VisitToolbar";
import { useAuthStore, useDepartmentStore } from "@/store";

interface VisitasPageProps {
  params: Promise<{ id: string }>;
}

export default function VisitasPage({ params }: VisitasPageProps) {
  const resolvedParams = use(params);
  const departmentId = Number(resolvedParams.id);
  const { departments } = useDepartmentStore(); // Para validar que el departamento existe (middleware ya lo hizo, pero por seguridad)
  const userId = useAuthStore((state) => state.user?.sub);
  const departmentExists = departments.find((dept) => dept.id === departmentId);

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
  } = useVisitFilters(departmentId, userId);

  // 2. Fetch de datos
  const { visits, total, isLoading } = useVisits(filters, {
    enabled: !!userId,
  }); // Solo habilitar si el departamento existe

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <PageHeader
        title="Visitas"
        subtitle={`Gestión técnica y comercial en terreno`}
        icon={ClipboardList}
        themeColor="sky" // <-- MAGIA AQUÍ: Esto pintará el icono y badge de celeste
        count={total}
        countLabel="registradas"
      />

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
            startDate={filters.startDate}
            endDate={filters.endDate}
            onDateChange={handleDateChange}
            onReset={handleReset}
            hasFilters={hasFilters}
          />
        }
      />
    </div>
  );
}
