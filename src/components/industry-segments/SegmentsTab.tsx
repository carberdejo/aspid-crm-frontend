"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, FilterX } from "lucide-react";
import { useIndustrySegments, useToggleIndustrySegmentStatus } from "@/hooks"; // <-- Asegúrate de exportar el hook
import { SegmentFormDialog } from "./SegmentFormDialog";
import { IndustrySegmentUpdateDto } from "@/interfaces/industry-segment.interface";
import { useSegmentFilters } from "@/hooks/catalogs/useSegmentFilters";
import { getSegmentColumns } from "./segmentColumns";
import { DataTable } from "..";

export function SegmentsTab() {
  const { toggleStatus } = useToggleIndustrySegmentStatus();

  // 1. Instanciamos el hook de filtros
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    hasFilters,
  } = useSegmentFilters();

  // 2. Conectamos los filtros al fetcher
  const { industrySegments, total, isLoading } = useIndustrySegments(filters);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<IndustrySegmentUpdateDto | null>(null);

  const handleEdit = (segment: IndustrySegmentUpdateDto) => {
    setSelectedSegment(segment);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSegment(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      getSegmentColumns({
        onEdit: handleEdit,
        onToggleStatus: (id, currentStatus) =>
          toggleStatus({ id, isActive: currentStatus }),
      }),
    [toggleStatus],
  );

  const Toolbar = (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por código o nombre..."
            className="pl-10 h-10 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-slate-400 hover:text-red-500 px-3"
          >
            <FilterX size={18} />
          </Button>
        )}
      </div>
      <Button
        onClick={handleCreate}
        className="gap-2 bg-secondary hover:bg-secondary-dark text-primary px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95"
      >
        <Plus size={18} />
        Registrar Segmentación
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={industrySegments || []} // Datos remotos
        isLoading={isLoading}
        filters={Toolbar}
        total={total || 0} // Total remoto
        pageSize={10}
        currentPage={page}
        onPageChange={setPage} // Enlace de paginación
      />

      <SegmentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        segment={selectedSegment}
      />
    </div>
  );
}
