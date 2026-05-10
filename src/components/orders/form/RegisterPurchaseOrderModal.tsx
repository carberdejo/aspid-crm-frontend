"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { CreatePurchaseOrderDto, Quote } from "@/interfaces";
import { useCreatePurchaseOrder } from "@/hooks";

interface RegisterPurchaseOrderModalProps {
  initialQuote?: Quote; // Opcional
  trigger?: React.ReactNode; // Para personalizar el botón que lo abre
}

export function RegisterPurchaseOrderModal({
  initialQuote,
  trigger,
}: RegisterPurchaseOrderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createPurchaseOrder, isPending } = useCreatePurchaseOrder();

  const handleSuccess = async (data: CreatePurchaseOrderDto) => {
    createPurchaseOrder(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-accent hover:bg-accent-dark text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-slate-900/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
            <ShoppingCart size={18} className="text-slate-400" />
            Orden de Compra
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] rounded-[3rem] p-10 overflow-hidden border-none shadow-2xl bg-white">
        <DialogHeader className="flex flex-row items-center gap-4 space-y-0 mb-8">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <ShoppingBag size={28} />
          </div>
          <div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-slate-800">
              REGISTRAR <span className="text-emerald-500">ORDEN</span>
            </DialogTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Gestión y vinculación de documentos aprobados
            </p>
          </div>
        </DialogHeader>

        {/* El formulario ahora estará dentro del diseño estandarizado */}
        <PurchaseOrderForm
          onSubmit={handleSuccess}
          isLoading={isPending}
          defaultQuote={initialQuote}
        />
      </DialogContent>
    </Dialog>
  );
}
