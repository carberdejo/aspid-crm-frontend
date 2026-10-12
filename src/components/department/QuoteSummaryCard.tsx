"use client";

import { DateFilterType } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { analyticsService } from "@/services/analytics.service";
import { DateFilterSelect } from "./DateFilterSelect"; // Importamos el nuevo componente
import { useOwnerFilter } from "@/hooks/auth/useOwnerFilter";

// Formateador Helper de Dinero
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

export function QuoteSummaryCard({ departmentId }: { departmentId: number }) {
  const [filter, setFilter] = useState<DateFilterType>("this-week");
  // Empleado: sin userId (el backend limita a lo suyo); admin: el suyo
  const { ownerId, isReady } = useOwnerFilter();
  const filters = { userId: ownerId, departmentId };

  const { data, isLoading } = useQuery({
    queryKey: ["quotes-summary", filters, filter],
    queryFn: () => analyticsService.getQuotesSummary(filters, filter),
    enabled: isReady,
  });

  if (isLoading) {
    return <Skeleton className="lg:col-span-4 h-[360px] rounded-[2rem]" />;
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm h-full w-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mb-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center sm:text-left">
          Resumen de Cotizaciones
        </h3>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <DateFilterSelect value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Bloque Central: El Gran Monto */}
      <div className="relative flex flex-col items-center justify-center my-auto max-w-full px-2">
        <span className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tighter leading-none select-all text-center break-words max-w-full block">
          {formatCurrency(data?.totalAmount || 0)}
        </span>

        {/* Alerta de pulso sutil reposicionada para que no estorbe */}
        <div className="absolute -top-3 -right-3 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
        </div>
      </div>

      {/* Bloque Inferior: Grid de Métricas Robustas */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 w-full border-t border-slate-100 pt-6">
        <MiniStatItem
          label="Pendiente"
          value={data?.pending || 0}
          icon={<Clock size={16} strokeWidth={2.5} />}
          variant="slate"
        />
        <MiniStatItem
          label="Aprobado"
          value={data?.approved || 0}
          icon={<FileText size={16} strokeWidth={2.5} />}
          variant="orange"
        />
        <MiniStatItem
          label="Total"
          value={data?.total || 0}
          icon={<TrendingUp size={16} strokeWidth={2.5} />}
          variant="blue"
        />
      </div>
    </div>
  );
}

interface MiniStatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "slate" | "orange" | "blue";
}

function MiniStatItem({ label, value, icon, variant }: MiniStatItemProps) {
  const colors = {
    slate: "text-slate-500 bg-slate-100/70",
    orange: "text-orange-600 bg-orange-50",
    blue: "text-blue-600 bg-blue-50",
  };

  return (
    <div className="flex flex-col items-center p-2 rounded-2xl hover:bg-slate-50/50 transition-colors duration-200">
      {/* Contenedor del Icono más grande y estilizado */}
      <div
        className={`p-2.5 rounded-xl mb-1.5 flex items-center justify-center ${colors[variant]}`}
      >
        {icon}
      </div>

      {/* El número ahora es el rey visual de la celda */}
      <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
        {value}
      </span>

      {/* Texto de soporte con control de tracking */}
      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center mt-0.5 truncate max-w-full">
        {label}
      </span>
    </div>
  );
}
