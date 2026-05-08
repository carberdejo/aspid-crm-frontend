"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Building2,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn, DateFilterType } from "@/lib/utils";
import { useVisitStats } from "@/hooks/analitycs/useVisitStats";
import { Skeleton } from "../ui/skeleton";

export function VisitPerformancePanel({ userId }: { userId: number }) {
  const [filterType, setFilterType] = useState<DateFilterType>("this-week");
  const { stats, isLoading } = useVisitStats(userId, filterType);

  if (isLoading) return <Skeleton className="h-[320px] rounded-[2.5rem]" />;

  const performanceItems = [
    {
      title: "Cliente Líder en Visitas",
      name: stats?.mostVisitedClient?.name || "Sin registros",
      count: stats?.mostVisitedClient?.count || 0,
      icon: Building2,
      color: "text-secondary",
    },
    {
      title: "Contacto con Mayor Fidelización",
      name: stats?.mostVisitedContact?.name || "Sin registros",
      count: stats?.mostVisitedContact?.count || 0,
      icon: Users,
      color: "text-blue-600",
    },
  ];

  return (
    // Agregamos h-full y flex flex-col para que el contenido se estire y alinee abajo
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full min-h-[320px]">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary text-white">
            <BarChart3 size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-primary uppercase italic tracking-tight truncate">
              Rendimiento de Campo
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Análisis de actividad
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-widest gap-2.5 px-4 shadow-none shrink-0"
            >
              <Calendar size={14} className="text-secondary" />
              {filterType.replace("-", " ")}
              <ChevronDown size={14} className="text-slate-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl p-2 shadow-xl border-slate-100 bg-white z-50"
          >
            {/* AGREGADOS LOS ITEMS QUE FALTABAN */}
            <DropdownMenuItem
              onClick={() => setFilterType("this-week")}
              className="text-[10px] font-bold uppercase cursor-pointer"
            >
              Esta Semana
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterType("last-week")}
              className="text-[10px] font-bold uppercase cursor-pointer"
            >
              Semana Pasada
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterType("this-month")}
              className="text-[10px] font-bold uppercase cursor-pointer"
            >
              Este Mes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterType("last-month")}
              className="text-[10px] font-bold uppercase cursor-pointer"
            >
              Mes Pasado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CUERPO - Agregamos flex-1 para que empuje al footer */}
      <div className="flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          {performanceItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group min-w-0">
              <div
                className={cn(
                  "shrink-0 h-12 w-12 rounded-xl flex items-center justify-center border-2 border-dashed",
                  item.color,
                  "border-current/30 group-hover:bg-primary group-hover:text-white transition-colors",
                )}
              >
                <item.icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate leading-none mb-1">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 overflow-hidden">
                  <h4 className="text-xs font-black text-primary uppercase italic truncate tracking-tight">
                    {item.name}
                  </h4>
                  {item.count > 0 && (
                    <span
                      className={cn(
                        "shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold bg-current/10",
                        item.color,
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PIE - Alineado abajo gracias al flex-1 del cuerpo */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50 bg-slate-50/50 p-4 rounded-2xl mt-auto">
        <div className="flex items-center gap-2 text-slate-600">
          <TrendingUp size={14} className="text-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
              Total
            </span>
            <span className="text-lg font-black text-primary font-mono leading-none tracking-tighter">
              {stats?.total || 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Calendar size={14} className="text-emerald-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
              Día Pico
            </span>
            <span className="text-[10px] font-black text-emerald-700 uppercase italic leading-none">
              {stats?.peakActivityDay?.date
                ? format(new Date(stats.peakActivityDay.date), "dd MMM", {
                    locale: es,
                  })
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
