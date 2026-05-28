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
import { DateFilterSelect } from "./DateFilterSelect";

export function VisitPerformancePanel({ userId }: { userId: number }) {
  const [filterType, setFilterType] = useState<DateFilterType>("this-week");
  const { stats, isLoading } = useVisitStats(userId, filterType);

  if (isLoading)
    return <Skeleton className="h-full min-h-[350px] rounded-[2.5rem]" />;

  const formatPeakDate = (dateString?: string | null) => {
    if (!dateString) return "Sin datos";
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    // Mantenemos h-full para que se estire al tamaño de la grilla
    <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col h-full w-full animate-in fade-in zoom-in-95 duration-500">
      {/* 1. HEADER COMPACTO */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-slate-400" />
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Visitas de Campo
            </h3>
          </div>
          <DateFilterSelect value={filterType} onChange={setFilterType} />
        </div>

        {/* Total Visitas - Hero Stat */}
        <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="p-2.5 rounded-xl bg-blue-100/50 text-blue-600 shrink-0">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Registrado
            </span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none mt-1">
              {stats?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 2. LISTA VERTICAL (Corregido el hueco, ahora se agrupa arriba) */}
      <div className="space-y-3">
        <StatRow
          icon={Building2}
          label="Cliente Líder"
          value={stats?.mostVisitedClient?.name || "Sin registros"}
          highlight={stats?.mostVisitedClient?.count || 0}
          theme="orange"
        />
        <StatRow
          icon={Users}
          label="Contacto Líder"
          value={stats?.mostVisitedContact?.name || "Sin registros"}
          highlight={stats?.mostVisitedContact?.count || 0}
          theme="blue"
        />
        <StatRow
          icon={Calendar}
          label="Día de Mayor Actividad"
          value={formatPeakDate(stats?.peakActivityDay?.date)}
          theme="emerald"
        />
      </div>
    </div>
  );
}

// ... (Sub-componente StatRow se mantiene igual)
interface StatRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: string | number;
  theme: "orange" | "blue" | "emerald";
}

function StatRow({ icon: Icon, label, value, highlight, theme }: StatRowProps) {
  const themeStyles = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-[1.25rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
      <div
        className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${themeStyles[theme]}`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        <p
          className="text-xs font-bold text-slate-700 leading-snug line-clamp-2"
          title={value}
        >
          {value}
        </p>
      </div>
      {highlight !== undefined && (
        <div className="shrink-0 ml-2 px-2.5 py-1 bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 rounded-lg">
          {highlight}
        </div>
      )}
    </div>
  );
}
