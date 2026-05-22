// src/components/portfolio/PortfoliosTab.tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, FilterX } from "lucide-react";
import { usePortfolios, useTogglePortfolioStatus } from "@/hooks"; // <-- Asegúrate de exportar el hook
import { PortfolioFormDialog } from "./PortfolioFormDialog";
import { Portfolio } from "@/interfaces/portfolio.interface";
import { usePortfolioFilters } from "@/hooks/portfolio/usePortfolioFilters";
import { getPortfolioColumns } from "./portfolioColumns";
import { DataTable } from "..";
import { PortfolioTeamDetail } from "./PortfolioTeamDetail";

export function PortfoliosTab() {
  const { togglePortfolioStatus } = useTogglePortfolioStatus();

  // 1. Instanciamos nuestro nuevo hook
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    handleReset,
    hasFilters,
  } = usePortfolioFilters();

  // 2. Le pasamos el objeto 'filters' al backend (importante extraer 'total' para la paginación)
  const { portfolios, total, isLoading } = usePortfolios(filters);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null,
  );

  const handleEdit = (portfolio: Portfolio | null) => {
    setSelectedPortfolio(portfolio);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPortfolio(null);
    setIsDialogOpen(true);
  };

  const columns = useMemo(
    () =>
      getPortfolioColumns({
        onEdit: handleEdit,
        onToggleStatus: (id, currentStatus) =>
          togglePortfolioStatus({ id, isActive: currentStatus }),
      }),
    [togglePortfolioStatus],
  );

  // 3. Toolbar actualizado con botón de limpiar
  const Toolbar = (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Buscar por código, tipo o zona..."
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
        className="gap-2 bg-secondary hover:bg-secondary-dark text-white px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95"
      >
        <Plus size={18} />
        Registrar Cartera
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={portfolios || []} // Pasamos directamente lo que viene del backend
        isLoading={isLoading}
        filters={Toolbar}
        total={total || 0} // Pasamos el total real del backend
        pageSize={10}
        currentPage={page}
        onPageChange={setPage} // Sincronizamos la paginación del DataTable con el Hook
        renderSubComponent={({ row }) => <PortfolioTeamDetail row={row} />}
      />

      <PortfolioFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        portfolio={selectedPortfolio}
      />
    </div>
  );
}
