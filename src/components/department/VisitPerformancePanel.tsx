"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateFilterType } from "@/lib/utils";
import { useVisitStats } from "@/hooks/analitycs/useVisitStats";
import { Skeleton } from "../ui/skeleton";
import { DateFilterSelect } from "./DateFilterSelect"; // Reutilizamos tu nuevo selector

export function VisitPerformancePanel({ userId }: { userId: number }) {
  const [filterType, setFilterType] = useState<DateFilterType>("this-week");
  const { stats, isLoading } = useVisitStats(userId, filterType);

  if (isLoading) return <Skeleton className="h-[380px] rounded-[2rem]" />;

  // Formateador seguro de fecha para el Día Pico
  const formatPeakDate = (dateString?: string | null) => {
    if (!dateString) return "Sin datos";
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[380px] w-full overflow-hidden">
      {/* 1. HEADER: Título y Selector alineados correctamente */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-slate-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider leading-none">
              Rendimiento de Campo
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              Análisis de actividad operativa
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <DateFilterSelect value={filterType} onChange={setFilterType} />
        </div>
      </div>

      {/* 2. GRID PRINCIPAL: Ocupa el espacio eficientemente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 flex-1 w-full">
        {/* Card: Cliente Líder */}
        <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/50 flex flex-col justify-between min-h-[100px] transition-all hover:bg-orange-50/70">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-orange-50 text-secondary shrink-0">
              <Building2 size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Cliente Líder en Visitas
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-auto">
            <h4 className="text-sm font-bold text-slate-800 truncate max-w-[80%]">
              {stats?.mostVisitedClient?.name || "Sin registros"}
            </h4>
            <span className="text-lg font-black text-secondary bg-orange-100/60 px-2.5 py-0.5 rounded-lg shrink-0">
              {stats?.mostVisitedClient?.count || 0}
            </span>
          </div>
        </div>

        {/* Card: Contacto Líder */}
        <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/50 flex flex-col justify-between min-h-[100px] transition-all hover:bg-blue-50/70">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Contacto con Mayor Fidelización
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 mt-auto">
            <h4 className="text-sm font-bold text-slate-800 truncate max-w-[80%]">
              {stats?.mostVisitedContact?.name || "Sin registros"}
            </h4>
            <span className="text-lg font-black text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-lg shrink-0">
              {stats?.mostVisitedContact?.count || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 3. FOOTER: Indicadores Macizos y Visibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full border-t border-slate-100 pt-5">
        {/* Total General */}
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/30">
          <div className="p-3 rounded-xl bg-blue-50 text-primary shrink-0">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Visitas
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {stats?.total || 0}
            </span>
          </div>
        </div>

        {/* Día Pico */}
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50/30">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Calendar size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Día de Mayor Actividad
            </span>
            <span className="text-base font-extrabold text-emerald-700 truncate tracking-tight mt-1 capitalize">
              {formatPeakDate(stats?.peakActivityDay?.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
