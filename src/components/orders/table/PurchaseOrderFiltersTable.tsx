// src/components/purchase-order/table/PurchaseOrderFiltersTable.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, FilterX, Calendar, SortAsc, SortDesc } from "lucide-react";
import { PurchaseOrderFilters, SortOrder } from "@/interfaces";

interface Props {
  filters: PurchaseOrderFilters;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (newFilters: Partial<PurchaseOrderFilters>) => void;
  onClear: () => void;
}

export function PurchaseOrderFiltersTable({
  filters,
  searchTerm,
  onSearchChange,
  onFilterChange,
  onClear,
}: Props) {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
        {/* 1. BUSCADOR UNIFICADO (term) */}
        <div className="flex-1 min-w-[250px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="BUSCAR ORDEN, COTIZACIÓN O CLIENTE..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-12 rounded-xl border-slate-200 bg-white text-[10px] uppercase tracking-widest shadow-sm"
          />
        </div>

        {/* 2. SELECT DE ORDENACIÓN (ASC/DESC) */}
        <Select
          value={filters.order || SortOrder.DESC}
          onValueChange={(v) => onFilterChange({ order: v as SortOrder })}
        >
          <SelectTrigger className="w-[160px] h-12 rounded-xl border-slate-200 font-black text-[10px] uppercase bg-white shadow-sm">
            <div className="flex items-center gap-2">
              {filters.order === SortOrder.ASC ? (
                <SortAsc size={14} />
              ) : (
                <SortDesc size={14} />
              )}
              <SelectValue placeholder="ORDENAR" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100">
            <SelectItem
              value={SortOrder.DESC}
              className="text-[10px] font-bold uppercase"
            >
              MÁS RECIENTES
            </SelectItem>
            <SelectItem
              value={SortOrder.ASC}
              className="text-[10px] font-bold uppercase"
            >
              MÁS ANTIGUOS
            </SelectItem>
          </SelectContent>
        </Select>

        {/* 3. POPOVER DE FECHAS (FILTROS AVANZADOS) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`h-12 rounded-xl border-slate-200 flex gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${filters.startDate || filters.endDate ? "border-emerald-500 text-emerald-600 bg-emerald-50/30" : ""}`}
            >
              <Calendar className="size-4" />
              Fechas
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 rounded-3xl p-6 shadow-2xl border-slate-100"
            align="end"
          >
            <div className="space-y-4">
              <h4 className="font-black text-primary uppercase text-xs">
                Rango de Recepción
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Desde
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      onFilterChange({ startDate: e.target.value })
                    }
                    className="h-10 rounded-lg text-[10px] font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      onFilterChange({ endDate: e.target.value })
                    }
                    className="h-10 rounded-lg text-[10px] font-bold"
                  />
                </div>
              </div>

              {(filters.startDate || filters.endDate) && (
                <Button
                  onClick={() =>
                    onFilterChange({ startDate: undefined, endDate: undefined })
                  }
                  variant="ghost"
                  className="w-full text-[9px] font-black uppercase text-rose-500 hover:bg-rose-50"
                >
                  Resetear Fechas
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* 4. BOTÓN LIMPIAR TODO */}
        <Button
          variant="ghost"
          onClick={onClear}
          className="h-12 px-6 rounded-xl text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors"
        >
          <FilterX size={16} className="mr-2" />
          Limpiar
        </Button>
      </div>
    </div>
  );
}
