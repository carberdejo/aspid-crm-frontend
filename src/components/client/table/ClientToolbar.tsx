// src/components/client/toolbar/ClientToolbar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { ClientFilters } from "@/hooks/client/useClientFilters";
import { useIndustrySegments, usePortfolios } from "@/hooks";
// IMPORTANTE: Importa los hooks para obtener los catálogos
// import { usePortfolios } from "@/hooks/usePortfolios";
// import { useSegments } from "@/hooks/useSegments";

interface ClientToolbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filters: ClientFilters;
  onFilterChange: (newFilters: Partial<ClientFilters>) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export function ClientToolbar({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onReset,
  hasFilters,
}: ClientToolbarProps) {
  // TODO: Reemplaza con tus hooks reales para traer la data del backend
  const { portfolios, isLoading: loadingPortfolios } = usePortfolios({});
  const { industrySegments, isLoading: loadingSegments } = useIndustrySegments(
    {},
  );

  const mappedPortfolios = portfolios.map((p) => ({
    value: String(p.id),
    label: p.code + " - " + p.type,
  }));
  const mappedSegments = industrySegments.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));
  // Mock de datos para que veas cómo funciona (Bórralo cuando conectes tus hooks)
  // const mockPortfolios = [
  //   { value: "1", label: "PORTAFOLIO VIP" },
  //   { value: "2", label: "PORTAFOLIO REGULAR" },
  // ];
  // const mockSegments = [
  //   { value: "1", label: "INDUSTRIA PESADA" },
  //   { value: "2", label: "TECNOLOGÍA Y SOFTWARE" },
  //   { value: "3", label: "MINERÍA" },
  // ];

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center bg-slate-50/50 p-4 rounded-[2rem] border border-slate-100">
        {/* BUSCADOR DE TEXTO */}
        <div className="flex-1 min-w-[250px] relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="BUSCAR POR NOMBRE O RUC..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 pl-12 rounded-xl border-slate-200 bg-white text-[10px] uppercase tracking-widest"
          />
        </div>

        {/* COMBOBOX DE PORTAFOLIO */}
        <div className="w-[200px] truncate">
          <Combobox
            options={mappedPortfolios} // Mapea tus datos reales aquí: portfolios.map(p => ({ value: String(p.id), label: p.name }))
            value={filters.portfolioId?.toString() || ""}
            onChange={(value) =>
              onFilterChange({ portfolioId: value ? Number(value) : undefined })
            }
            placeholder="CARTERA..."
            // disabled={loadingPortfolios}
          />
        </div>

        {/* COMBOBOX DE SEGMENTO */}
        <div className="w-[200px]">
          <Combobox
            options={mappedSegments} // Mapea tus datos reales aquí
            value={filters.segmentId?.toString() || ""}
            onChange={(value) =>
              onFilterChange({ segmentId: value ? Number(value) : undefined })
            }
            placeholder="SEGMENTACIÓN..."
            // disabled={loadingSegments}
          />
        </div>

        {/* BOTÓN LIMPIAR */}
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-11 px-6 rounded-xl text-slate-400 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-colors shrink-0"
          >
            <FilterX size={16} className="mr-2" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
