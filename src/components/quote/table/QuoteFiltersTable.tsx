// src/components/quote/table/QuoteFiltersTable.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, FilterX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuoteStatus } from "@/interfaces";
import { QuoteFilters } from "@/services/quote.service";

interface QuoteFiltersProps {
  onClear: () => void;
  filters: QuoteFilters;
  onFilterChange: (newFilters: Partial<QuoteFilters>) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export function QuoteFiltersTable({
  filters,
  onFilterChange,
  onClear,
  searchTerm,
  onSearchChange,
}: QuoteFiltersProps) {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
        {/* BUSCADOR UNIFICADO (Usa term en el backend) */}
        <div className="flex-1 min-w-[200px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="BUSCAR POR Nº, CLIENTE O CONTACTO..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 pl-12 rounded-xl border-slate-200 bg-white text-[10px] uppercase tracking-widest"
          />
        </div>

        {/* SELECTS RÁPIDOS */}
        <div className="flex gap-2">
          <Select
            value={filters.status || "ALL"}
            onValueChange={(v) =>
              onFilterChange({
                status: v === "ALL" ? undefined : (v as QuoteStatus),
              })
            }
          >
            <SelectTrigger className="w-[140px] h-11 rounded-xl border-slate-200 font-bold text-[10px] uppercase">
              <SelectValue placeholder="ESTADO" />
            </SelectTrigger>
            <SelectContent>
              {/* OPCIÓN POR DEFECTO */}
              <SelectItem
                value="ALL"
                className="text-[10px] font-bold uppercase"
              >
                TODOS LOS ESTADOS
              </SelectItem>
              {Object.values(QuoteStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={onClear}
            className="h-11 px-4 rounded-xl text-slate-400 hover:text-red-500 font-black text-[10px] uppercase"
          >
            <FilterX size={16} className="mr-2" />
            Limpiar
          </Button>
        </div>

        {/* POPOVER PARA FILTROS AVANZADOS (Fechas) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-200 flex gap-2 font-black text-[10px] uppercase"
            >
              <Filter className="size-4" />
              Más Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-3xl p-6 shadow-2xl">
            <div className="space-y-4">
              <h4 className="font-black text-primary uppercase text-xs">
                Filtros Avanzados
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase">
                    Desde
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      onFilterChange({ startDate: e.target.value })
                    }
                    className="h-10 text-[10px] font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase">
                    Hasta
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      onFilterChange({ endDate: e.target.value })
                    }
                    className="h-10 text-[10px] font-bold"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
