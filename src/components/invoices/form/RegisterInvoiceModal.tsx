"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Receipt } from "lucide-react";
import { StandardButton } from "@/components/common/StandardButton";
import { InvoiceForm } from "./InvoiceForm";
import { PurchaseOrder } from "@/interfaces"; // IMPORTANTE: Agregar esto

interface RegisterInvoiceModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
  preselectedOrder?: PurchaseOrder; // NUEVA PROP
}

export function RegisterInvoiceModal({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
  hideTrigger = false,
  preselectedOrder, // RECIBIMOS LA PROP
}: RegisterInvoiceModalProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (externalOnOpenChange) externalOnOpenChange(newOpen);
    if (!isControlled) setLocalOpen(newOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <StandardButton
              icon={Receipt}
              label="Facturar"
              colorClass="bg-rose-600 hover:bg-rose-700 text-white"
            />
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[800px] rounded-[3rem] p-10 overflow-hidden border-none shadow-2xl bg-white">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0 mb-8">
          <div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-slate-800">
              REGISTRAR <span className="text-rose-500">FACTURA</span>
            </DialogTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Cierre financiero y emisión de comprobantes de pago
            </p>
          </div>
        </DialogHeader>

        <InvoiceForm
          onSuccessCallback={() => handleOpenChange(false)}
          preselectedOrder={preselectedOrder} // SE LA PASAMOS AL FORMULARIO
        />
      </DialogContent>
    </Dialog>
  );
}
