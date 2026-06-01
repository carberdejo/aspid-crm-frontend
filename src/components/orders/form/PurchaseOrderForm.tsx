"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  DollarSign,
  Calendar,
  Hash,
  Settings2,
  ChevronDown,
  CreditCard,
  User,
  Search,
  FileText,
} from "lucide-react";
import { useQuotes } from "@/hooks";
import { Quote, QuoteStatus, QuoteCurrency } from "@/interfaces";
import { QuoteSelector } from "./QuoteSelector";
import {
  purchaseOrderFormSchema,
  PurchaseOrderFormValues,
} from "@/lib/schemas/order";
import { useAuthStore } from "@/store";

interface PurchaseOrderFormProps {
  onSubmit: (data: PurchaseOrderFormValues) => void;
  isLoading: boolean;
  defaultQuote?: Quote;
  departmentId?: number; // NUEVA PROP PARA FILTRAR COTIZACIONES POR DEPARTAMENTO
}

export function PurchaseOrderForm({
  onSubmit,
  isLoading,
  defaultQuote,
  departmentId,
}: PurchaseOrderFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(
    defaultQuote || null,
  );

  // Estado para mostrar/ocultar la configuración de moneda
  const [showAdvanced, setShowAdvanced] = useState(false);

  const userId = useAuthStore((state) => state.user?.sub);

  const { quotes } = useQuotes({
    term: searchTerm,
    status: QuoteStatus.PENDIENTE,
    limit: 5,
    userId,
    departmentId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      quoteId: defaultQuote?.id || undefined,
      receivedAt: new Date().toISOString().split("T")[0],
      poNumber: "",
      amount: defaultQuote ? Number(defaultQuote.amount) : 0,
      currency: defaultQuote ? defaultQuote.currency : QuoteCurrency.USD,
    },
  });

  // Observamos la moneda en tiempo real para el símbolo del input
  const currentCurrency = useWatch({ control, name: "currency" });

  const handleSelectQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setValue("quoteId", quote.id, { shouldValidate: true });

    // Autocompletamos los valores financieros
    setValue("amount", Number(quote.amount), { shouldValidate: true });
    setValue("currency", quote.currency, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COLUMNA 1: INPUTS DE LA ORDEN */}
        <div className="space-y-5">
          {/* 1. Selector de Cotización */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Seleccionar Cotización
            </Label>
            {defaultQuote ? (
              <div className="h-14 px-4 flex items-center bg-emerald-50 border border-emerald-100 rounded-2xl">
                <span className="text-[11px] font-black text-emerald-700 uppercase">
                  VINCULADO A: {defaultQuote.quoteNumber}
                </span>
              </div>
            ) : (
              <QuoteSelector
                options={quotes || []}
                onSearch={setSearchTerm}
                onSelect={handleSelectQuote}
                selectedId={selectedQuote?.id}
              />
            )}
            {errors.quoteId && (
              <p className="text-[9px] text-rose-500 font-bold uppercase animate-in fade-in slide-in-from-top-1">
                {errors.quoteId.message}
              </p>
            )}
          </div>

          {/* 2. Número de Orden de Compra */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Número de Orden de Compra
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

          {/* 3. Monto Final de la OC */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Monto Final de la OC
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm italic">
                {currentCurrency === QuoteCurrency.USD
                  ? "$"
                  : currentCurrency === QuoteCurrency.PEN
                    ? "S/"
                    : currentCurrency}
              </span>
              <Input
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                className="pl-16 h-12 rounded-xl border-slate-200 text-lg font-black text-primary focus-visible:ring-emerald-500"
              />
            </div>
            {errors.amount && (
              <p className="text-[9px] text-rose-500 font-bold uppercase">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* 4. Selector Avanzado de Moneda (Oculto por defecto) */}
          {showAdvanced && (
            <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="max-w-[250px] space-y-2">
                <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Cambiar Moneda del Documento
                </Label>
                <Select
                  value={currentCurrency}
                  onValueChange={(val) =>
                    setValue("currency", val as QuoteCurrency, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white font-bold text-xs text-primary">
                    <SelectValue placeholder="Seleccione Moneda" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem
                      value={QuoteCurrency.PEN}
                      className="text-xs font-bold uppercase"
                    >
                      Soles (PEN)
                    </SelectItem>
                    <SelectItem
                      value={QuoteCurrency.USD}
                      className="text-xs font-bold uppercase"
                    >
                      Dólares (USD)
                    </SelectItem>
                    <SelectItem
                      value={QuoteCurrency.CLP}
                      className="text-xs font-bold uppercase"
                    >
                      Pesos Chilenos (CLP)
                    </SelectItem>
                    <SelectItem
                      value={QuoteCurrency.MXN}
                      className="text-xs font-bold uppercase"
                    >
                      Pesos Mexicanos (MXN)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-[9px] text-rose-500 font-bold uppercase">
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botón para alternar la vista de moneda */}
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2 text-[9px] font-black uppercase text-slate-400 hover:text-primary transition-all px-2 h-8"
            >
              <Settings2 size={14} />
              Configurar Moneda
              <ChevronDown
                size={12}
                className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* 5. Fecha de Recepción */}
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

        {/* COLUMNA 2: RESUMEN AUTOMÁTICO (Diseño Profesional) */}
        <div className="flex flex-col h-full">
          <div
            className={`flex-1 rounded-[2rem] p-7 border transition-all duration-500 flex flex-col ${
              selectedQuote
                ? "bg-slate-50/50 border-slate-200 shadow-sm"
                : "bg-slate-50 border-slate-100 border-dashed opacity-70"
            }`}
          >
            {/* Cabecera del Panel */}
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    selectedQuote
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <FileText size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">
                    Documento Base
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Referencia de Cotización
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido Dinámico */}
            {selectedQuote ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <SummaryItem
                  label="Cliente"
                  value={selectedQuote.client.commercialName}
                  icon={<Building2 size={14} />}
                  className="col-span-2"
                />
                <SummaryItem
                  label="RUC"
                  value={selectedQuote.client.ruc || "---"}
                  icon={<CreditCard size={14} />}
                />
                <SummaryItem
                  label="Nº Cotización"
                  value={selectedQuote.quoteNumber}
                  icon={<Hash size={14} />}
                />
                <SummaryItem
                  label="Contacto"
                  value={
                    selectedQuote.contact?.firstName
                      ? `${selectedQuote.contact.firstName} ${selectedQuote.contact.lastName}`
                      : "Sin contacto asignado"
                  }
                  icon={<User size={14} />}
                  className="col-span-2"
                />

                {/* Highlight del Monto Original */}
                <div className="col-span-2 mt-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DollarSign size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Monto Cotizado
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-800 font-mono tracking-tighter">
                    {selectedQuote.currency}{" "}
                    {new Intl.NumberFormat("es-PE").format(
                      Number(selectedQuote.amount),
                    )}
                  </span>
                </div>
              </div>
            ) : (
              // Estado Vacío (Empty State) Elegante
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                <div className="h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                  <Search size={24} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Ninguna cotización seleccionada
                </p>
                <p className="text-[10px] font-medium text-slate-400 max-w-[200px] leading-relaxed">
                  Busque y seleccione un documento para visualizar sus datos
                  técnicos aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* FOOTER: BOTÓN DE GUARDAR */}
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

function SummaryItem({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <span className="text-sm font-bold text-slate-700 truncate" title={value}>
        {value}
      </span>
    </div>
  );
}
