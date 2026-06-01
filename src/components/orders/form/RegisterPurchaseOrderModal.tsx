"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShoppingCart } from "lucide-react";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { CreatePurchaseOrderDto, Quote } from "@/interfaces";
import { useCreatePurchaseOrder } from "@/hooks";
import { StandardButton } from "@/components/common/StandardButton";

interface RegisterPurchaseOrderModalProps {
  initialQuote?: Quote;
  // --- Props de Control Externo ---
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // --- Props de Botón Nativo ---
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
  departmentId?: number; // NUEVA PROP PARA FILTRAR COTIZACIONES POR DEPARTAMENTO
}

export function RegisterPurchaseOrderModal({
  initialQuote,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
  hideTrigger = false,
  departmentId,
}: RegisterPurchaseOrderModalProps) {
  const [localOpen, setLocalOpen] = useState(false);

  // Decide si obedece al Dashboard (externo) o a sí mismo (interno)
  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (externalOnOpenChange) externalOnOpenChange(newOpen);
    if (!isControlled) setLocalOpen(newOpen);
  };

  const { mutate: createPurchaseOrder, isPending } = useCreatePurchaseOrder();

  const handleSuccess = async (data: CreatePurchaseOrderDto) => {
    createPurchaseOrder(data, {
      onSuccess: () => handleOpenChange(false), // Cierra el modal al terminar
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* MAGIA: Si hideTrigger es TRUE, esto desaparece totalmente */}
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <StandardButton
              icon={ShoppingCart}
              label="Orden de Compra"
              colorClass="bg-accent hover:bg-accent-dark text-white"
            />
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[800px] rounded-[3rem] p-10 overflow-hidden border-none shadow-2xl bg-white">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0 mb-8">
          <div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-slate-800">
              REGISTRAR <span className="text-emerald-500">ORDEN</span>
            </DialogTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Gestión y vinculación de documentos aprobados
            </p>
          </div>
        </DialogHeader>

        <PurchaseOrderForm
          onSubmit={handleSuccess}
          isLoading={isPending}
          defaultQuote={initialQuote}
          departmentId={departmentId} // PASAMOS EL ID DEL DEPARTAMENTO PARA FILTRAR LAS COTIZACIONES
        />
      </DialogContent>
    </Dialog>
  );
}
