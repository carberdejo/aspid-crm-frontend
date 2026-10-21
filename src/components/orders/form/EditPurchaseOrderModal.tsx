"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Hash, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { PurchaseOrder, QuoteCurrency } from "@/interfaces";
import { useUpdatePurchaseOrder } from "@/hooks";
import {
  updatePurchaseOrderSchema,
  UpdatePurchaseOrderFormValues,
} from "@/lib/schemas/order";

const CURRENCY_OPTIONS = [
  { value: QuoteCurrency.PEN, label: "Soles (PEN)" },
  { value: QuoteCurrency.USD, label: "Dólares (USD)" },
  { value: QuoteCurrency.CLP, label: "Pesos Chilenos (CLP)" },
  { value: QuoteCurrency.MXN, label: "Pesos Mexicanos (MXN)" },
];

interface EditPurchaseOrderModalProps {
  po: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPurchaseOrderModal({
  po,
  open,
  onOpenChange,
}: EditPurchaseOrderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary uppercase">
            Editar <span className="text-emerald-600">Orden de Compra</span>
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Cotización {po.quoteNumber} · {po.clientName}
          </p>
        </DialogHeader>

        {/* Se monta solo al abrir: así toma los datos actuales de la fila */}
        {open && (
          <EditPurchaseOrderForm po={po} onDone={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditPurchaseOrderForm({
  po,
  onDone,
}: {
  po: PurchaseOrder;
  onDone: () => void;
}) {
  const invoiced = Number(po.invoicedAmount || 0);
  // Con facturas vigentes la moneda queda fija: las facturas están en esa moneda
  const currencyLocked = invoiced > 0;
  const { mutate: updateOrder, isPending } = useUpdatePurchaseOrder();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatePurchaseOrderFormValues>({
    resolver: zodResolver(updatePurchaseOrderSchema(invoiced)),
    defaultValues: {
      poNumber: po.poNumber,
      receivedAt: po.receivedAt ? String(po.receivedAt).slice(0, 10) : "",
      amount: Number(po.amount),
      currency: po.currency as QuoteCurrency,
    },
  });
  const currency = useWatch({ control, name: "currency" });

  const onSubmit = (values: UpdatePurchaseOrderFormValues) => {
    updateOrder(
      {
        id: po.id,
        data: {
          ...values,
          // La moneda no se envía si está bloqueada (el backend la rechazaría si cambia)
          currency: currencyLocked ? undefined : values.currency,
        },
      },
      { onSuccess: onDone },
    );
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: po.currency || "USD",
    }).format(value);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
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
            className="pl-10 h-12 rounded-xl border-slate-200 uppercase font-bold focus-visible:ring-emerald-500"
          />
        </div>
        {errors.poNumber && (
          <p className="text-[9px] text-rose-500 font-bold uppercase">
            {errors.poNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
            Monto de la OC
          </Label>
          <Input
            type="number"
            step="0.01"
            {...register("amount", { valueAsNumber: true })}
            className="h-12 rounded-xl border-slate-200 text-lg font-black text-primary focus-visible:ring-emerald-500"
          />
          {errors.amount && (
            <p className="text-[9px] text-rose-500 font-bold uppercase">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">
            Moneda
          </Label>
          <Select
            value={currency}
            onValueChange={(val) =>
              setValue("currency", val as QuoteCurrency, {
                shouldValidate: true,
              })
            }
            disabled={currencyLocked}
          >
            <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-white font-bold text-xs text-primary">
              <SelectValue placeholder="Seleccione Moneda" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {CURRENCY_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs font-bold uppercase"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {invoiced > 0 && (
        <div className="flex gap-2 items-start p-3 rounded-2xl bg-blue-50 border border-blue-100">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
            Ya facturado: {formatMoney(invoiced)}. El monto no puede ser menor y
            la moneda no se puede cambiar mientras tenga facturas vigentes.
          </p>
        </div>
      )}

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
        {errors.receivedAt && (
          <p className="text-[9px] text-rose-500 font-bold uppercase">
            {errors.receivedAt.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 px-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
        >
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
