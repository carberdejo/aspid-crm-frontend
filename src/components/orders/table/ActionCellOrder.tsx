"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Download, Receipt, Ban } from "lucide-react";
import { DocumentStatus, PurchaseOrder } from "@/interfaces";
import { useParams, useRouter } from "next/navigation";
import { RegisterInvoiceModal } from "@/components/invoices/form/RegisterInvoiceModal";
import { AnnulDialog } from "@/components/shared/AnnulDialog";
import { useAnnulPurchaseOrder, useCanModify } from "@/hooks";
import { EditPurchaseOrderModal } from "../form/EditPurchaseOrderModal";

interface ActionsCellProps {
  po: PurchaseOrder;
}

export const ActionsCellOrder = ({ po }: ActionsCellProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAnnulOpen, setIsAnnulOpen] = useState(false);

  // Editar, anular y facturar: solo el dueño de la cotización o un admin, y solo si está vigente
  const isActive = po.status !== DocumentStatus.ANULADA;
  const canModify = useCanModify(po.userId) && isActive;
  const canInvoice = canModify && (po.remainingAmount || 0) > 0;
  // Con facturas vigentes no se puede anular: primero se anulan las facturas
  const hasInvoices = Number(po.invoicedAmount || 0) > 0;

  const { mutate: annulOrder, isPending: isAnnulling } =
    useAnnulPurchaseOrder();

  const handleGoToDetail = () => {
    router.push(`/department/${departmentId}/order/${po.id}`);
  };

  const handleDownloadPDF = () => {
    console.log("Descargando PDF de la PO:", po.poNumber);
  };

  const handleAnnul = (annulReason: string) => {
    annulOrder(
      { id: po.id, data: { annulReason } },
      { onSuccess: () => setIsAnnulOpen(false) },
    );
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

      {canModify && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full shrink-0"
            title="Editar Orden"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3 size={16} />
          </Button>

          {/* span: un botón deshabilitado no muestra su title */}
          <span
            title={
              hasInvoices
                ? "Anule primero las facturas de esta orden"
                : "Anular Orden"
            }
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full shrink-0"
              onClick={() => setIsAnnulOpen(true)}
              disabled={hasInvoices}
            >
              <Ban size={16} />
            </Button>
          </span>

          <EditPurchaseOrderModal
            po={po}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          <AnnulDialog
            isOpen={isAnnulOpen}
            onOpenChange={setIsAnnulOpen}
            documentLabel="la OC"
            documentNumber={po.poNumber}
            description={`La orden quedará registrada como anulada y la cotización ${po.quoteNumber} volverá a PENDIENTE para registrar una nueva OC o rechazarla.`}
            onConfirm={handleAnnul}
            isLoading={isAnnulling}
          />
        </>
      )}
    </div>
  );
};
