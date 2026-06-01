"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import { DeliveryForm } from "./DeliveryForm";

interface RegisterDeliveryModalProps {
  onSuccess?: () => void;
  // --- Props de Control Externo ---
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // --- Props de Botón Nativo ---
  trigger?: React.ReactNode;
  hideTrigger?: boolean;
}

export function RegisterDeliveryModal({
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
  hideTrigger = false,
}: RegisterDeliveryModalProps) {
  const [localOpen, setLocalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : localOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (externalOnOpenChange) externalOnOpenChange(newOpen);
    if (!isControlled) setLocalOpen(newOpen);
  };

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    handleOpenChange(false); // Cierra el modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          {trigger || (
            <Button className="gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95">
              <Truck size={18} />
              Registrar Entrega
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white flex flex-col">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-200 rounded-full" />
            REGISTRO DE ENTREGA
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 pt-1 font-medium">
            Gestión de actividades de ACME & CIA
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-0 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <DeliveryForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
