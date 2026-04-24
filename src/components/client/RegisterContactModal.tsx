"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, AlertCircle } from "lucide-react";
import { ContactForm } from "..";
import { ClientAndContactResponseCreate, Contact } from "@/interfaces/client.interface";

interface RegisterContactModalProps {
  // clientId es ahora opcional (puede llegar desde FlowContainer dinámicamente)
  clientId?: number;
  
  // Control externo del modal (ej: desde FlowContainer)
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Callback cuando se crea un contacto exitosamente
  onSuccess?: (contact: ClientAndContactResponseCreate<Contact>) => void;
  
  // Prop para cambiar el estilo del botón si queremos (opcional)
  triggerVariant?: "default" | "outline" | "ghost";
  
  // Mostrar trigger (botón) solo si no hay control externo
  showTrigger?: boolean;
}

export function RegisterContactModal({ 
  clientId, 
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  onSuccess,
  triggerVariant = "outline",
  showTrigger = true
}: RegisterContactModalProps) {
  // Determinar si usar control externo o interno
  const isControlled = externalIsOpen !== undefined && externalOnOpenChange !== undefined;
  
  // Si no está controlado externamente, usar estado local
  const [localOpen, setLocalOpen] = React.useState(false);
  const open = isControlled ? externalIsOpen : localOpen;
  const setOpen = isControlled ? externalOnOpenChange : setLocalOpen;

  const handleSuccess = (data?: ClientAndContactResponseCreate<Contact>) => {
    if (data && onSuccess) {
      onSuccess(data); // El FlowContainer se encargará de cerrarlo
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Solo mostrar trigger si showTrigger es true y no está controlado externamente */}
      {showTrigger && !isControlled && (
        <DialogTrigger asChild>
          <Button 
            variant={triggerVariant} 
            className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest h-9"
          >
            <UserPlus size={14} />
            Nuevo Contacto
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-secondary flex items-center gap-2 uppercase tracking-tighter">
            <div className="w-1 h-6 bg-gray-200 rounded-full" />
            Añadir Contacto
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 font-medium">
            Asigna una persona de contacto directo para esta empresa.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-8 pt-0">
          {clientId ? (
            <ContactForm clientId={clientId} onSuccess={handleSuccess} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 gap-3 text-gray-500 bg-red-50 rounded-lg border border-red-100">
              <AlertCircle size={24} className="text-red-400" />
              <span className="text-sm font-semibold text-red-600">Selecciona un cliente primero</span>
              <span className="text-xs text-red-500">Debes seleccionar o registrar un cliente antes de agregar contactos</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}