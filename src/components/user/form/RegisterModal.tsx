"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { PersonalForm } from "./personal-form";

export function RegisterModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-secondary hover:bg-secondary-dark text-primary px-4 h-10 rounded-lg font-semibold flex items-center transition-all shadow-md active:scale-95">
          <UserPlus size={18} />
          Registrar Personal
        </Button>
      </DialogTrigger>

<DialogContent className="sm:max-w-[620px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white flex flex-col">
  {/* Header fijo */}
  <DialogHeader className="p-8 pb-4">
    <DialogTitle className="text-2xl font-bold text-secondary-text flex items-center gap-2">
      <div className="w-1 h-6 bg-gray-200 rounded-full" />
      REGISTRO DE PERSONAL
    </DialogTitle>
    <DialogDescription className="text-sm text-gray-500 pt-1">
      Configuración de accesos y departamentos en ASPID CRM.
    </DialogDescription>
  </DialogHeader>
  
  {/* Área de scroll interna */}
  <div className="p-8 pt-0 overflow-y-auto max-h-[70vh] custom-scrollbar">
    <PersonalForm onSuccess={() => setOpen(false)} />
  </div>
</DialogContent>
    </Dialog>
  );
}