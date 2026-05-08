"use client";

import { useState } from "react";
import {
  MapPin,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useVisitStats } from "@/hooks/analitycs/useVisitStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DateFilterType, getDateRange } from "@/lib";

export function VisitStatsGrid({ userId }: { userId: number }) {
  // Estado local para el filtro de tiempo
  const [filterType, setFilterType] = useState<DateFilterType>("this-week");

  // Obtenemos el rango basado en el tipo seleccionado
  //   const { startDate, endDate } = getDateRange(filterType);

  // Llamada al hook integrada
  const { stats, isLoading } = useVisitStats(userId, filterType);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[160px]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[1.5rem] border border-slate-100 animate-pulse flex flex-col justify-center items-center"
          >
            <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Visitas",
      value: stats?.total || 0,
      label: "Registradas",
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      title: "Cliente Top",
      value: stats?.mostVisitedClient?.name || "N/A",
      label: `${stats?.mostVisitedClient?.count || 0} visitas`,
      icon: MapPin,
      color: "text-secondary",
      bg: "bg-secondary/5",
    },
    {
      title: "Contacto Clave",
      value: stats?.mostVisitedContact?.name || "N/A",
      label: `Fidelización: ${stats?.mostVisitedContact?.count || 0}`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Día de Mayor Flujo",
      value: stats?.peakActivityDay?.date
        ? format(new Date(stats.peakActivityDay.date), "dd 'de' MMMM", {
            locale: es,
          })
        : "N/A",
      label: `Pico: ${stats?.peakActivityDay?.count || 0} salidas`,
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col min-h-[320px]">
      <div className="space-y-4">
        {/* SELECTOR DE PERIODO - Alineado a la derecha */}
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Resumen de Actividad
          </h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest gap-2"
              >
                <Calendar size={12} className="text-secondary" />
                {filterType.replace("-", " ")}
                <ChevronDown size={12} className="text-slate-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl p-2 shadow-xl border-slate-100"
            >
              <DropdownMenuItem
                onClick={() => setFilterType("this-week")}
                className="text-[10px] font-bold uppercase py-2 cursor-pointer"
              >
                Esta Semana
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("last-week")}
                className="text-[10px] font-bold uppercase py-2 cursor-pointer"
              >
                Semana Pasada
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("this-month")}
                className="text-[10px] font-bold uppercase py-2 cursor-pointer"
              >
                Este Mes
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterType("last-month")}
                className="text-[10px] font-bold uppercase py-2 cursor-pointer"
              >
                Mes Pasado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* GRID DE KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color} transition-colors group-hover:bg-primary group-hover:text-white`}
                >
                  <kpi.icon size={18} />
                </div>
                <TrendingUp
                  size={12}
                  className="text-slate-100 group-hover:text-primary/20 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 leading-none">
                  {kpi.title}
                </p>
                <h3 className="text-[13px] font-black text-primary uppercase italic truncate tracking-tight py-1">
                  {kpi.value}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-70">
                  {kpi.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
