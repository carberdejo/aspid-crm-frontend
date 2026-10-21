"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/interfaces";
import { useUpdateInvoice } from "@/hooks";
import {
  updateInvoiceFormSchema,
  UpdateInvoiceFormValues,
} from "@/lib/schemas/invoice";

interface EditInvoiceModalProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInvoiceModal({
  invoice,
  open,
  onOpenChange,
}: EditInvoiceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary uppercase">
            Editar <span className="text-rose-600">Factura</span>
          </DialogTitle>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Orden de Compra {invoice.poNumber} · {invoice.businessName}
          </p>
        </DialogHeader>

        {/* Se monta solo al abrir: así toma los datos actuales de la fila */}
        {open && (
          <EditInvoiceForm
            invoice={invoice}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditInvoiceForm({
  invoice,
  onDone,
}: {
  invoice: Invoice;
  onDone: () => void;
}) {
  const { mutate: updateInvoice, isPending } = useUpdateInvoice();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateInvoiceFormValues>({
    resolver: zodResolver(updateInvoiceFormSchema),
    defaultValues: {
      invoiceNumber: invoice.invoiceNumber,
      amount: Number(invoice.amount),
      issueDate: String(invoice.issueDate).slice(0, 10),
    },
  });

  // El backend valida que el nuevo monto, con las demás facturas vigentes, no pase el total de la OC
  const onSubmit = (values: UpdateInvoiceFormValues) => {
    updateInvoice({ id: invoice.id, data: values }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
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
          Monto Facturado
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm italic">
            {invoice.currency}
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
        {errors.issueDate && (
          <p className="text-[9px] text-rose-500 font-bold uppercase">
            {errors.issueDate.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 px-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-200"
        >
          {isPending ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
