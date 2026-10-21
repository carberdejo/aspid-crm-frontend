"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Mismo mínimo que valida el backend (AnnulDocumentDto)
const MIN_REASON_LENGTH = 10;

interface AnnulDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ej: "Orden de Compra" o "Factura" */
  documentLabel: string;
  documentNumber: string;
  description: string;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

/** Confirmación para anular una OC o factura: pide el motivo, que queda registrado */
export function AnnulDialog({
  isOpen,
  onOpenChange,
  documentLabel,
  documentNumber,
  description,
  onConfirm,
  isLoading,
}: AnnulDialogProps) {
  const [reason, setReason] = useState("");
  const isValid = reason.trim().length >= MIN_REASON_LENGTH;

  const handleOpenChange = (open: boolean) => {
    if (!open) setReason("");
    onOpenChange(open);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="rounded-[2.5rem] p-8 sm:max-w-[420px]">
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="font-black text-slate-800 uppercase text-center text-xl">
            ¿Anular {documentLabel}{" "}
            <span className="text-rose-600">{documentNumber}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center mt-2 text-xs font-bold text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2 space-y-1">
          <Textarea
            placeholder="Motivo de la anulación..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="rounded-xl border-slate-200 focus-visible:ring-rose-500 min-h-[100px] text-sm font-medium"
          />
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 pl-1">
            Mínimo {MIN_REASON_LENGTH} caracteres
          </p>
        </div>

        <AlertDialogFooter className="mt-4 flex sm:justify-center gap-3">
          <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] w-full mt-0">
            Cancelar
          </AlertDialogCancel>
          <Button
            onClick={() => onConfirm(reason.trim())}
            disabled={isLoading || !isValid}
            className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black text-white uppercase text-[10px] w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={14} />
            ) : (
              "Confirmar Anulación"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
