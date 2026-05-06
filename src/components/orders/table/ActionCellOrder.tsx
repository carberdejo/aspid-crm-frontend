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
import { Eye, Edit3, Download } from "lucide-react";
import { PurchaseOrder } from "@/interfaces";
import { useParams, useRouter } from "next/navigation";

interface ActionsCellProps {
  po: PurchaseOrder;
}

export const ActionsCellOrder = ({ po }: ActionsCellProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Hook para acciones de PO (Asumiendo que implementaste updatePurchaseOrder)
  // const { updatePurchaseOrder, isUpdating } = usePurchaseOrders();

  const handleGoToDetail = () => {
    // Ajusta esta ruta según tu estructura de carpetas
    router.push(`/department/${departmentId}/order/${po.id}`);
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar el PDF de la PO
    console.log("Descargando PDF de la PO:", po.poNumber);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full transition-colors"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {/* 2. DESCARGAR SUSTENTO / PDF */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full transition-colors"
        onClick={handleDownloadPDF}
        title="Descargar PDF"
      >
        <Download size={16} />
      </Button>

      {/* 3. EDITAR (Solo si es necesario corregir el número o fecha) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full"
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

          {/* 
              Aquí podrías reutilizar un formulario simplificado 
              que solo permita cambiar el poNumber y receivedAt 
          */}
          <div className="py-4 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Cotización relacionada: {po.quoteNumber}
            </p>
            {/* <PurchaseOrderForm 
                defaultValues={po} 
                onSubmit={handleUpdate} 
                isLoading={isUpdating} 
             /> */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Formulario de edición en construcción
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
