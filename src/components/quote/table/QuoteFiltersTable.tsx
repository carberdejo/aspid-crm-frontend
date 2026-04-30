"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
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
}

export function QuoteFiltersTable({
  filters,
  onFilterChange,
  onClear,
}: QuoteFiltersProps) {
  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
        {/* BUSCADOR PRINCIPAL */}
        <div className="flex-1 min-w-[200px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="BUSCAR POR Nº COTIZACIÓN..."
            value={filters.quoteNumber || ""}
            onChange={(e) => onFilterChange({ quoteNumber: e.target.value })}
            className="h-12 pl-12 rounded-xl border-slate-200 bg-white  text-[10px] uppercase tracking-widest"
          />
        </div>

        {/* SELECTS RÁPIDOS */}
        <div className="flex gap-2">
          {/* SELECT DE ESTADO */}
          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange({ status: v as QuoteStatus })}
          >
            <SelectTrigger className="w-[150px] h-11 rounded-xl border-slate-200 font-bold text-[10px] uppercase">
              <SelectValue placeholder="ESTADO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuoteStatus.PENDIENTE}>
                {QuoteStatus.PENDIENTE}
              </SelectItem>
              <SelectItem value={QuoteStatus.APROBADO}>
                {QuoteStatus.APROBADO}
              </SelectItem>
              <SelectItem value={QuoteStatus.RECHAZADO}>
                {QuoteStatus.RECHAZADO}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* SELECT DE TIPO */}
          <Select
            value={filters.type}
            onValueChange={(v) => onFilterChange({ type: v })}
          >
            <SelectTrigger className="w-[150px] h-11 rounded-xl border-slate-200 font-bold text-[10px] uppercase">
              <SelectValue placeholder="TIPO" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRODUCTO">PRODUCTO</SelectItem>
              <SelectItem value="SERVICIO">SERVICIO</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={onClear}
            className="h-11 px-4 rounded-xl text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest"
          >
            Limpiar
          </Button>
        </div>

        {/* BOTÓN DE FILTROS AVANZADOS (Aquí metes el resto) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-200 flex gap-2 font-black text-[10px] uppercase tracking-widest"
            >
              <Filter className="size-4" />
              Más Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-3xl p-6 shadow-2xl border-slate-100">
            <div className="space-y-4">
              <h4 className="font-black text-primary uppercase text-xs tracking-tighter">
                Filtros Avanzados
              </h4>

              {/* Aquí pones los filtros que "sobran" */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Tipo de Orden
                </label>
                <Select
                  value={filters.orderType}
                  onValueChange={(v) => onFilterChange({ orderType: v })}
                >
                  {/* ... trigger y items ... */}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Desde
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
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
                    value={filters.endDate}
                    onChange={(e) =>
                      onFilterChange({ endDate: e.target.value })
                    }
                    className="h-10 rounded-lg text-[10px] font-bold"
                  />
                </div>
              </div>

              <Button
                onClick={onClear}
                className="w-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold text-[10px] uppercase"
              >
                Limpiar todo
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
