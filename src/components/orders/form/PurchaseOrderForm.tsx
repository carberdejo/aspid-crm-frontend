"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Building2,
  DollarSign,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { useQuotes } from "@/hooks";
import { Quote, QuoteStatus } from "@/interfaces";
import { QuoteSelector } from "./QuoteSelector";
import {
  purchaseOrderFormSchema,
  PurchaseOrderFormValues,
} from "@/lib/schemas/order";

export function PurchaseOrderForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: PurchaseOrderFormValues) => void;
  isLoading: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // 1. Desestructuración corregida según tu hook useQuotes
  const { quotes } = useQuotes({
    term: searchTerm,
    status: QuoteStatus.PENDIENTE,
    limit: 5,
  });

  // 2. Inicialización corregida del formulario
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      receivedAt: new Date().toISOString().split("T")[0],
      poNumber: "",
    },
  });

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    // 3. setValue ahora está disponible directamente
    setValue("quoteId", quote.id, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COLUMNA 1: INPUTS DE LA ORDEN */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Seleccionar Cotización
            </Label>
            <QuoteSelector
              options={quotes || []} // Aseguramos un array vacío si está cargando
              onSearch={setSearchTerm}
              onSelect={handleSelectQuote}
              selectedId={selectedQuote?.id}
            />
            {errors.quoteId && (
              <p className="text-[9px] text-rose-500 font-bold uppercase animate-in fade-in slide-in-from-top-1">
                {errors.quoteId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Número de PO
            </Label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <Input
                {...register("poNumber")}
                placeholder="Ej: PO-9988"
                className="pl-10 h-12 rounded-xl border-slate-200 uppercase font-bold focus-visible:ring-emerald-500"
              />
            </div>
            {errors.poNumber && (
              <p className="text-[9px] text-rose-500 font-bold uppercase">
                {errors.poNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Fecha de Recepción
            </Label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <Input
                {...register("receivedAt")}
                type="date"
                className="pl-10 h-12 rounded-xl border-slate-200 font-bold focus-visible:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA 2: RESUMEN AUTOMÁTICO */}
        <div
          className={`rounded-[2.5rem] p-6 border-2 transition-all duration-500 ${
            selectedQuote
              ? "bg-emerald-50 border-emerald-100 shadow-inner"
              : "bg-slate-50 border-slate-100 opacity-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`p-2 rounded-lg transition-colors ${
                selectedQuote
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-300 text-slate-100"
              }`}
            >
              <CheckCircle2 size={18} />
            </div>
            <h3 className="font-black text-primary uppercase text-xs">
              Resumen del documento
            </h3>
          </div>

          <div className="space-y-4">
            <InfoField
              label="Cliente"
              value={selectedQuote?.client.commercialName || "Sin seleccionar"}
              icon={<Building2 size={14} />}
            />
            <InfoField
              label="Monto"
              value={
                selectedQuote
                  ? `${selectedQuote.currency} ${selectedQuote.amount}`
                  : "---"
              }
              icon={<DollarSign size={14} />}
            />
            <InfoField
              label="Nº Cotización"
              value={selectedQuote?.quoteNumber || "---"}
              icon={<Hash size={14} />}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isLoading || !selectedQuote}
          className="h-12 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
        >
          {isLoading ? "Registrando..." : "Guardar Orden de Compra"}
        </Button>
      </div>
    </form>
  );
}

function InfoField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-white/50 pb-2">
      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
        {value}
      </span>
    </div>
  );
}
