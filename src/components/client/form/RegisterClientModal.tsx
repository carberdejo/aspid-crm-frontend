"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { ClienteCreateResponseItem } from "@/interfaces";

interface RegisterClientModalProps {
  // Control externo del modal (ej: desde FlowContainer)
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Callback cuando se crea un cliente exitosamente
  onSuccess?: (client: ClienteCreateResponseItem) => void;

  // Mostrar trigger (botón) solo si no hay control externo
  showTrigger?: boolean;
}

export function RegisterClientModal({
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
  showTrigger = true,
}: RegisterClientModalProps) {
  // Determinar si usar control externo o interno
  const isControlled =
    externalIsOpen !== undefined && externalOnOpenChange !== undefined;

  // Si no está controlado externamente, usar estado local
  // (fallback para uso standalone como antes)
  const [localOpen, setLocalOpen] = React.useState(false);
  const open = isControlled ? externalIsOpen : localOpen;
  const setOpen = isControlled ? externalOnOpenChange : setLocalOpen;

  // Handler para el éxito del formulario
  const handleSuccess = (newClient?: ClienteCreateResponseItem) => {
    if (newClient && onSuccess) {
      onSuccess(newClient); // El FlowContainer se encargará de cerrarlo al terminar su lógica
    } else {
      setOpen(false); // Solo lo cerramos localmente si no hubo onSuccess (fallback)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Solo mostrar trigger si showTrigger es true y no está controlado externamente */}
      {showTrigger && !isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2 bg-secondary hover:bg-secondary-dark text-primary px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95">
            <Plus size={18} />
            Registrar Empresa
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white flex flex-col">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-secondary-text flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-200 rounded-full" />
            REGISTRO DE EMPRESA
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 pt-1 font-medium">
            Gestión de cartera de clientes y facturación en ASPID CRM.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-0 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <ClientForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
