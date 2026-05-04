"use client";

import { Input } from "@/components/ui/input";
import { Search, FilterX, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisitToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  startDate?: string;
  endDate?: string;
  onDateChange: (
    type: "startDate" | "endDate",
    val: string | undefined,
  ) => void;
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
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 px-2 text-slate-500">
            <Calendar size={14} />
            <span className="text-[10px] font-bold uppercase">Desde</span>
          </div>
          <Input
            type="date"
            value={startDate || ""}
            onChange={(e) =>
              onDateChange("startDate", e.target.value || undefined)
            }
            className="h-8 border-none bg-transparent text-xs w-32 focus-visible:ring-0"
          />
          <div className="w-[1px] h-4 bg-slate-200" />
          <div className="flex items-center gap-2 px-2 text-slate-500">
            <span className="text-[10px] font-bold uppercase">Hasta</span>
          </div>
          <Input
            type="date"
            value={endDate || ""}
            onChange={(e) =>
              onDateChange("endDate", e.target.value || undefined)
            }
            className="h-8 border-none bg-transparent text-xs w-32 focus-visible:ring-0"
          />
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 text-slate-400 hover:text-secondary font-black text-[10px] uppercase"
          >
            <FilterX size={16} className="mr-2" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
