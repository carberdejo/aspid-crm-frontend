"use client";

import { DateFilterType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { analyticsService } from "@/services/analytics.service";

export function QuoteSummaryCard({ userId }: { userId: number }) {
  const [filter, setFilter] = useState<DateFilterType>("this-week");

  const { data, isLoading } = useQuery({
    queryKey: ["quotes-summary", userId, filter],
    queryFn: () => analyticsService.getQuotesSummary(userId, filter),
  });

  if (isLoading)
    return <Skeleton className="lg:col-span-4 h-[320px] rounded-[2.5rem]" />;
  return (
    <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center justify-center min-h-[320px] relative">
      {/* Selector de Fecha Minimalista */}
      <div className="absolute top-8 right-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as DateFilterType)}
          className="text-[10px] font-bold text-slate-400 bg-slate-50 border-none rounded-full px-3 py-1 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <option value="this-week">Esta semana</option>
          <option value="last-week">Última semana</option>
          <option value="this-month">Este mes</option>
          <option value="last-month">Mes pasado</option>
        </select>
      </div>

      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
        Resumen de Cotizaciones
      </h3>

      <div className="relative flex flex-col items-center">
        <span className="text-8xl font-black text-primary tracking-tighter leading-none">
          {data?.total || 0}
        </span>
        {/* Monto total cotizado */}
        <span className="mt-2 text-lg font-bold text-slate-500">
          {new Intl.NumberFormat("es-PE", {
            style: "currency",
            currency: "PEN",
          }).format(data?.totalAmount || 0)}
        </span>
        <div className="absolute -top-1 -right-2 h-4 w-4 bg-secondary rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-10 w-full border-t border-slate-50 pt-8">
        <MiniStatItem
          label="Pendiente" // Según tu imagen 'Revisión'
          value={data?.pending || 0}
          icon={<Clock size={14} />}
          variant="slate"
        />
        <MiniStatItem
          label="Aprobado" // Según tu imagen 'Esperando' (o ajusta según tu lógica)
          value={data?.approved || 0}
          icon={<FileText size={14} />}
          variant="orange"
        />
        <MiniStatItem
          label="Total"
          value={data?.total || 0}
          icon={<TrendingUp size={14} />}
          variant="blue"
        />
      </div>
    </div>
  );
}

function MiniStatItem({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "slate" | "orange" | "blue";
}) {
  const colors = {
    slate: "text-slate-400 bg-slate-50",
    orange: "text-secondary bg-orange-50",
    blue: "text-primary bg-blue-50",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`p-2 rounded-xl ${colors[variant]}`}>{icon}</div>
      <span className="text-xl font-black text-primary">{value}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center">
        {label}
      </span>
    </div>
  );
}
