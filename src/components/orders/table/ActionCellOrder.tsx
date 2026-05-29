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
import { Eye, Edit3, Download, Receipt } from "lucide-react";
import { PurchaseOrder } from "@/interfaces";
import { useParams, useRouter } from "next/navigation";
import { RegisterInvoiceModal } from "@/components/invoices/form/RegisterInvoiceModal";

interface ActionsCellProps {
  po: PurchaseOrder;
}

export const ActionsCellOrder = ({ po }: ActionsCellProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const canInvoice = (po.remainingAmount || 0) > 0;

  const handleGoToDetail = () => {
    router.push(`/department/${departmentId}/order/${po.id}`);
  };

  const handleDownloadPDF = () => {
    console.log("Descargando PDF de la PO:", po.poNumber);
  };

  return (
    // justify-end asegura que todo se alinee a la derecha de la celda
    <div className="flex items-center justify-end gap-1 pr-2">
      {/* EL TRUCO VISUAL: Contenedor de ancho fijo (aprox 105px) */}
      <div className="w-[105px] flex justify-end mr-1">
        {canInvoice && (
          <RegisterInvoiceModal
            preselectedOrder={po} // PASAMOS LA ORDEN SELECCIONADA AL MODAL
            trigger={
              <Button
                variant="default"
                size="sm"
                className="h-8 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-black px-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-rose-100 transition-colors shadow-none"
              >
                <Receipt size={14} strokeWidth={2.5} />
                Facturar
              </Button>
            }
          />
        )}
      </div>

      {/* Íconos estándar (Ya no se moverán) */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full shrink-0"
        onClick={handleDownloadPDF}
        title="Descargar PDF"
      >
        <Download size={16} />
      </Button>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full shrink-0"
            title="Editar Orden"
          >
            <Edit3 size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary uppercase">
              Editar <span className="text-emerald-600">Orden de Compra</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Formulario en construcción
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
