"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Download, Edit3, FileX } from "lucide-react";
import { DocumentStatus, Invoice } from "@/interfaces"; // Ajusta a la ruta real de tu interfaz
import { useParams, useRouter } from "next/navigation";
import { AnnulDialog } from "@/components/shared/AnnulDialog";
import { useAnnulInvoice, useCanModify } from "@/hooks";
import { EditInvoiceModal } from "../form/EditInvoiceModal";

interface ActionsCellInvoiceProps {
  invoice: Invoice;
}

export const ActionsCellInvoice = ({ invoice }: ActionsCellInvoiceProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);

  // Editar y anular: solo el dueño de la cotización o un admin, y solo si está vigente
  const canModify =
    useCanModify(invoice.userId) && invoice.status !== DocumentStatus.ANULADA;
  const { mutate: annulInvoice, isPending: isAnnulling } = useAnnulInvoice();

  const handleGoToDetail = () => {
    // Ajusta esta ruta a donde vivan los detalles de tus facturas
    router.push(`/department/${departmentId}/invoices/${invoice.id}`);
  };

  const handleDownloadPDF = () => {
    // Lógica para descargar el PDF de la factura (Ej: llamar a un endpoint de NestJS que devuelva un Blob)
    console.log("Descargando PDF de la Factura:", invoice.invoiceNumber);
  };

  const handleAnnul = (annulReason: string) => {
    annulInvoice(
      { id: invoice.id, data: { annulReason } },
      { onSuccess: () => setIsVoidOpen(false) },
    );
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

      {canModify && (
        <>
          {/* 3. EDITAR */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full transition-colors shrink-0"
            title="Editar Factura"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3 size={16} />
          </Button>

          {/* 4. ANULAR (pide el motivo) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0"
            title="Anular Factura"
            onClick={() => setIsVoidOpen(true)}
          >
            <FileX size={16} />
          </Button>

          <EditInvoiceModal
            invoice={invoice}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          <AnnulDialog
            isOpen={isVoidOpen}
            onOpenChange={setIsVoidOpen}
            documentLabel="la factura"
            documentNumber={invoice.invoiceNumber}
            description={`Dejará de contar en lo facturado de la orden ${invoice.poNumber}. Su número queda reservado y no se podrá volver a usar.`}
            onConfirm={handleAnnul}
            isLoading={isAnnulling}
          />
        </>
      )}
    </div>
  );
};
