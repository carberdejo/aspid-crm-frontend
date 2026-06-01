"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Hash, Receipt, CreditCard } from "lucide-react";
import {
  createInvoiceFormSchema,
  CreateInvoiceFormValues,
} from "@/lib/schemas/invoice";

// IMPORTACIONES DE HOOKS Y COMPONENTES
import { OrderSelector } from "./OrderSelector";
import { BillingStatus, PurchaseOrder } from "@/interfaces"; // Ajusta la ruta
import { useCreateInvoice, usePurchaseOrders } from "@/hooks";
import { useAuthStore, useDepartmentStore } from "@/store";

interface InvoiceFormProps {
  onSuccessCallback?: () => void; // Solo avisa al padre si terminó con éxito para que cierre el modal
  preselectedOrder?: PurchaseOrder;
  departmentId?: number; // Opcional, por si quieres filtrar las órdenes por departamento desde el inicio
}

export function InvoiceForm({
  onSuccessCallback,
  preselectedOrder,
  departmentId,
}: InvoiceFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    preselectedOrder ?? null,
  );
  const userId = useAuthStore((state) => state.user?.sub); // Para filtrar las órdenes del usuario, si es necesario

  const { orders, isLoading: isOrdersLoading } = usePurchaseOrders({
    term: searchTerm,
    userId: userId,
    billingStatus: `${BillingStatus.PENDIENTE_FACTURACION},
      ${BillingStatus.FACTURADO_PARCIAL}`,
    // Recomendado filtrar por las no facturadas
    departmentId,
  });

  // 2. Hook para crear la factura (POST) - ¡AHORA VIVE AQUÍ!
  const { createInvoice, isCreating } = useCreateInvoice();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues: {
      orderId: preselectedOrder?.id ?? 0,
      invoiceNumber: "",
      amount: preselectedOrder ? Number(preselectedOrder.remainingAmount) : 0,
      issueDate: new Date().toISOString().split("T")[0],
      currency: preselectedOrder?.currency ?? "USD",
    },
  });

  const handleSelectOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setValue("orderId", order.id, { shouldValidate: true });
    setValue("amount", Number(order.remainingAmount), { shouldValidate: true });
    setValue("currency", order.currency, { shouldValidate: true });
  };

  // 3. Función de Envío
  const onSubmit = (data: CreateInvoiceFormValues) => {
    createInvoice(data, {
      onSuccess: () => {
        // Si todo salió bien en NestJS, le avisamos al componente padre (el Modal)
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("currency")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* COLUMNA 1: INPUTS */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Seleccionar Orden de Compra
            </Label>

            <OrderSelector
              options={orders}
              onSearch={setSearchTerm}
              onSelect={handleSelectOrder}
              selectedId={selectedOrder?.id}
              isLoading={isOrdersLoading}
            />

            {errors.orderId && (
              <p className="text-[9px] text-rose-500 font-bold uppercase animate-in fade-in">
                {errors.orderId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Número de Factura / Comprobante
            </Label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <Input
                {...register("invoiceNumber")}
                placeholder="Ej: F001-000234"
                className="pl-10 h-12 rounded-xl border-slate-200 uppercase font-bold focus-visible:ring-rose-500"
              />
            </div>
            {errors.invoiceNumber && (
              <p className="text-[9px] text-rose-500 font-bold uppercase">
                {errors.invoiceNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Monto a Facturar
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm italic">
                {selectedOrder?.currency || "USD"}
              </span>
              <Input
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
                className="pl-16 h-12 rounded-xl border-slate-200 text-lg font-black text-primary focus-visible:ring-rose-500"
              />
            </div>
            {errors.amount && (
              <p className="text-[9px] text-rose-500 font-bold uppercase">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
              Fecha de Emisión
            </Label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <Input
                {...register("issueDate")}
                type="date"
                className="pl-10 h-12 rounded-xl border-slate-200 font-bold focus-visible:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA 2: DETALLE PREMIUM INMUTABLE */}
        <div className="flex flex-col h-full">
          <div
            className={`flex-1 rounded-4xl p-7 border transition-all duration-500 flex flex-col ${
              selectedOrder
                ? "bg-slate-50/50 border-slate-200 shadow-sm"
                : "bg-slate-50 border-slate-100 border-dashed opacity-70"
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    selectedOrder
                      ? "bg-rose-100 text-rose-600"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Receipt size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">
                    Orden de Referencia
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    Información de Contrato Real
                  </p>
                </div>
              </div>
            </div>

            {selectedOrder ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <SummaryItem
                  label="Cliente"
                  value={selectedOrder.clientName}
                  icon={<Building2 size={14} />}
                  className="col-span-2"
                />
                <SummaryItem
                  label="RUC"
                  value={
                    selectedOrder.ruc || selectedOrder.client?.ruc || "---"
                  }
                  icon={<CreditCard size={14} />}
                />
                <SummaryItem
                  label="Nº Orden Compra"
                  value={selectedOrder.poNumber}
                  icon={<Hash size={14} />}
                />

                <div className="col-span-2 mt-2 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CreditCard size={16} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Total de la Orden
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-800 font-mono tracking-tighter">
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: selectedOrder.currency,
                    }).format(Number(selectedOrder.amount))}
                  </span>
                </div>
                {/* 2. NUEVO: Barra de Progreso de Facturación */}
                <div className="col-span-2 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-5 flex flex-col gap-3">
                  {/* Cabecera de la barra */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Avance de Facturación
                    </span>
                    <span className="text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md">
                      {selectedOrder.billingPercentage || 0}%
                    </span>
                  </div>

                  {/* La Barra Visual */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${selectedOrder.billingPercentage || 0}%`,
                      }}
                    />
                  </div>

                  {/* Desglose de montos */}
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Ya Facturado
                      </span>
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        {new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: selectedOrder.currency,
                        }).format(Number(selectedOrder.invoicedAmount || 0))}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Saldo Pendiente
                      </span>
                      <span className="text-sm font-black text-rose-600 font-mono tracking-tighter">
                        {new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: selectedOrder.currency,
                        }).format(Number(selectedOrder.remainingAmount || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                <div className="h-16 w-16 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                  <Receipt size={24} className="text-slate-300" />
                </div>
                <p className="text-xs font-bold text-slate-500 mb-1">
                  Ninguna orden seleccionada
                </p>
                <p className="text-[10px] font-medium text-slate-400 max-w-50 leading-relaxed">
                  Asigne un documento comercial para visualizar el balance de
                  facturación.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isCreating || !selectedOrder} // Se desactiva si está creando
          className="h-12 px-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
        >
          {isCreating ? "Procesando..." : "Emitir Factura"}
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
