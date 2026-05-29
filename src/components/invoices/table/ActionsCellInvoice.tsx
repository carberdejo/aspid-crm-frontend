"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Download, FileX } from "lucide-react";
import { Invoice } from "@/interfaces"; // Ajusta a la ruta real de tu interfaz
import { useParams, useRouter } from "next/navigation";

interface ActionsCellInvoiceProps {
  invoice: Invoice;
}

export const ActionsCellInvoice = ({ invoice }: ActionsCellInvoiceProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;

  // Estado para un posible modal de confirmación de anulación
  const [isVoidOpen, setIsVoidOpen] = useState(false);

  const handleGoToDetail = () => {
    // Ajusta esta ruta a donde vivan los detalles de tus facturas
    router.push(`/department/${departmentId}/invoices/${invoice.id}`);
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar el PDF de la factura (Ej: llamar a un endpoint de NestJS que devuelva un Blob)
    console.log("Descargando PDF de la Factura:", invoice.invoiceNumber);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full transition-colors shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {/* 2. DESCARGAR SUSTENTO / PDF */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full transition-colors shrink-0"
        onClick={handleDownloadPDF}
        title="Descargar Comprobante PDF"
      >
        <Download size={16} />
      </Button>

      {/* 3. ANULAR FACTURA (Con Modal de Seguridad) */}
      <Dialog open={isVoidOpen} onOpenChange={setIsVoidOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0"
            title="Anular Factura"
          >
            <FileX size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-800 uppercase text-center">
              ¿Anular{" "}
              <span className="text-rose-600">{invoice.invoiceNumber}</span>?
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4 text-center">
            <p className="text-xs font-bold text-slate-500">
              Esta acción invalidará el documento comercial generado para la
              orden <span className="text-slate-800">{invoice.poNumber}</span>.
            </p>
            <div className="p-4 bg-rose-50 rounded-2xl border border-dashed border-rose-200">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                Requiere permisos de administrador
              </span>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <Button
                variant="outline"
                className="rounded-xl text-xs font-bold"
                onClick={() => setIsVoidOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                onClick={() => {
                  console.log("Enviando petición de anulación a NestJS...");
                  setIsVoidOpen(false);
                }}
              >
                Confirmar Anulación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
