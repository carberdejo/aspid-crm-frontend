"use client";

import { DateFilterType } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DateFilterSelectProps {
  value: DateFilterType;
  onChange: (value: DateFilterType) => void;
}

export function DateFilterSelect({ value, onChange }: DateFilterSelectProps) {
  return (
    <div className="relative inline-block w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DateFilterType)}
        className="w-full sm:w-auto text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl pl-4 pr-10 py-2 outline-none appearance-none cursor-pointer transition-all duration-200 shadow-sm focus:ring-2 focus:ring-primary/10 focus:border-slate-300"
      >
        <option value="this-week">Esta semana</option>
        <option value="last-week">Última semana</option>
        <option value="this-month">Este mes</option>
        <option value="last-month">Mes pasado</option>
      </select>
      {/* Icono indicador personalizado */}
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
        <ChevronDown size={14} strokeWidth={2.5} />
      </div>
    </div>
  );
}
