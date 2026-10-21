"use client";

import { Input } from "@/components/ui/input";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components";

interface VisitToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  startDate?: string;
  endDate?: string;
  onDateChange: (dates: { startDate?: string; endDate?: string }) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export function VisitToolbar({
  searchValue,
  onSearch,
  startDate,
  endDate,
  onDateChange,
  onReset,
  hasFilters,
}: VisitToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 bg-white">
      <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
        {/* Buscador Global */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar visita..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-10 border-slate-200 rounded-xl"
          />
        </div>

        {/* Rango de Fechas */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateChange}
          title="Rango de Visita"
          // Estilo específico para el departamento de Visitas (Orange/Amber)
          className="border-orange-400 text-orange-600 hover:border-orange-500 hover:text-orange-700 active:text-orange-700 bg-orange-50/20"
          btnColor="bg-orange-500 hover:bg-orange-600"
        />

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 text-slate-400 hover:text-secondary-text font-black text-[10px] uppercase"
          >
            <FilterX size={16} className="mr-2" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
