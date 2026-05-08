// src/components/shared/DateRangeFilter.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar, Check, X } from "lucide-react";

interface DateRangeFilterProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (dates: { startDate?: string; endDate?: string }) => void;
  title?: string;
  className?: string; // Color del trigger (borde/texto)
  btnColor?: string; // Color del botón Aplicar (ej: "bg-emerald-600 hover:bg-emerald-700")
}

export function DateRangeFilter({
  startDate,
  endDate,
  onDateChange,
  title = "Filtrar por rango",
  className,
  btnColor = "bg-primary hover:bg-primary/90", // Color por defecto
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Estado local que solo se actualiza al abrir el popover o escribir
  const [localDates, setLocalDates] = useState({ startDate, endDate });

  // Manejador para cuando el Popover cambia de estado (se abre/cierra)
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Al abrir, sincronizamos con lo que haya en los filtros globales
      setLocalDates({ startDate, endDate });
    }
  };

  const hasActiveFilter = !!startDate || !!endDate;

  const handleApply = () => {
    onDateChange(localDates);
    setIsOpen(false);
  };

  const handleReset = () => {
    const empty = { startDate: undefined, endDate: undefined };
    setLocalDates(empty);
    onDateChange(empty);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-12 rounded-xl border-slate-200 flex gap-2 font-black text-[10px] uppercase tracking-widest transition-all 
            ${hasActiveFilter ? `${className} bg-slate-50/50` : "text-slate-400"}`}
        >
          <Calendar className="size-4" />
          {hasActiveFilter ? "Fechas Activas" : "Fechas"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 rounded-[2rem] p-6 shadow-2xl border-slate-100 z-50 bg-white"
        align="end"
      >
        <div className="space-y-4">
          <h4 className="font-black text-primary uppercase text-[11px] tracking-tighter">
            {title}
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Desde
              </label>
              <Input
                type="date"
                value={localDates.startDate || ""}
                onChange={(e) =>
                  setLocalDates((prev) => ({
                    ...prev,
                    startDate: e.target.value || undefined,
                  }))
                }
                className="h-11 rounded-xl text-[11px] font-bold border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Hasta
              </label>
              <Input
                type="date"
                value={localDates.endDate || ""}
                onChange={(e) =>
                  setLocalDates((prev) => ({
                    ...prev,
                    endDate: e.target.value || undefined,
                  }))
                }
                className="h-11 rounded-xl text-[11px] font-bold border-slate-200"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {hasActiveFilter && (
              <Button
                onClick={handleReset}
                variant="ghost"
                className="flex-1 text-[9px] font-black uppercase text-rose-500 hover:bg-rose-50 h-11 rounded-xl"
              >
                <X size={14} className="mr-1" />
                Limpiar
              </Button>
            )}
            <Button
              onClick={handleApply}
              className={`flex-[2] h-11 rounded-xl font-black text-[9px] uppercase tracking-widest text-white shadow-md transition-transform active:scale-95 ${btnColor}`}
            >
              <Check size={14} className="mr-1" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
