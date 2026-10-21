"use client";

import { Button } from "@/components/ui/button";
import { useQuoteDetail, useQuotes } from "@/hooks/quote/useQuotes";
import { useCanModify } from "@/hooks/auth/useCanModify";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuoteForm } from "../form/QuoteForm";
import {
  Eye,
  Edit3,
  Trash2,
  Loader2,
  ShoppingCart,
  FileX, // Opcional: Para cambiar el icono de rechazar si lo prefieres
} from "lucide-react";
import { Quote, QuoteCreateDto, QuoteStatus } from "@/interfaces";
import { useRouter } from "next/navigation";
import { QuoteFormValues } from "@/lib/schemas/quote";
import { RegisterPurchaseOrderModal } from "@/components/orders/form/RegisterPurchaseOrderModal";

export const ActionsCell = ({ quote }: { quote: Quote }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: fullQuote, isLoading: isLoadingDetail } = useQuoteDetail(
    isEditOpen ? quote.id : undefined,
  );

  const { updateQuote, isUpdating, rejectQuote, isRejecting } = useQuotes();

  const handleUpdate = async (values: Partial<QuoteFormValues>) => {
    try {
      updateQuote({
        id: quote.id,
        data: {
          ...values,
          clientId: Number(values.clientId),
          contactId: Number(values.contactId),
          // Responsable: el admin puede cambiarlo; el backend revalida cliente y colaborador
          userId: Number(values.userId || quote.userId),
          // null quita el colaborador; el backend revalida el nuevo
          collaboratorId: values.collaboratorId
            ? Number(values.collaboratorId)
            : null,
          createdAt: values.createdAt ? new Date(values.createdAt) : undefined,
        } as QuoteCreateDto,
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error en la petición de update:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectQuote({
        id: quote.id,
        reason: { statusReason: rejectReason },
      });
      setIsRejectOpen(false);
    } catch (error) {}
  };

  const handleGoToDetail = () => {
    router.push(`/department/${quote.departmentId}/quote/${quote.id}`);
  };

  const isPending = quote.status === QuoteStatus.PENDIENTE;
  // Editar y rechazar: solo el dueño o un admin (el colaborador solo ve), y solo si está pendiente
  const canModify = useCanModify(quote.userId);
  const canEdit = isPending && canModify;

  return (
    // justify-end y pr-2 para alinear todo a la derecha como en las otras tablas
    <div className="flex items-center justify-center gap-1">
      {/* 1. ACCIÓN PRINCIPAL DESTACADA: Generar Orden de Compra */}
      {/* Usamos un contenedor de ancho fijo para que no mueva los iconos al desaparecer */}
      <div className="w-[115px] flex justify-end mr-1">
        {isPending && (
          <RegisterPurchaseOrderModal
            initialQuote={quote}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="h-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 font-black px-3 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 transition-colors shadow-none"
                title="Generar Orden de Compra"
              >
                <ShoppingCart size={14} strokeWidth={2.5} />
                Aprobar
              </Button>
            }
          />
        )}
      </div>

      {/* 2. VER DETALLE */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-primary rounded-full shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {/* 3. EDITAR */}
      {canEdit && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-full shrink-0"
              title="Editar Cotización"
            >
              <Edit3 size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] rounded-[2.5rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary uppercase">
                Editar <span className="text-blue-600">Cotización</span>
              </DialogTitle>
            </DialogHeader>

            {isLoadingDetail ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Cargando información completa...
                </span>
              </div>
            ) : (
              <QuoteForm
                key={fullQuote?.id}
                departmentId={fullQuote?.departmentId || 0}
                isLoading={isUpdating}
                onSubmit={handleUpdate}
                clientLabel={fullQuote?.client?.commercialName}
                defaultValues={{
                  ...fullQuote,
                  userId: fullQuote?.userId ? String(fullQuote.userId) : "",
                  collaboratorId: fullQuote?.collaboratorId
                    ? String(fullQuote.collaboratorId)
                    : "",
                  quoteNumber: fullQuote?.quoteNumber ?? "",
                  description: fullQuote?.description ?? "",
                  amount: fullQuote?.amount ?? 0,
                  clientId: fullQuote?.clientId
                    ? String(fullQuote.clientId)
                    : "",
                  contactId: fullQuote?.contactId
                    ? String(fullQuote.contactId)
                    : "",
                  createdAt: fullQuote?.createdAt
                    ? new Date(fullQuote.createdAt).toISOString().split("T")[0]
                    : "",
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* 4. RECHAZAR / ANULAR (Mismo estilo que en facturas) */}
      {canEdit && (
        <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full shrink-0 transition-colors"
              title="Rechazar Cotización"
            >
              <Trash2 size={16} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[2.5rem] p-8 sm:max-w-[400px]">
            <AlertDialogHeader className="text-center">
              <AlertDialogTitle className="font-black text-slate-800 uppercase text-center text-xl">
                ¿Rechazar <span className="text-rose-600">Cotización</span>?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center mt-2 text-xs font-bold text-slate-500">
                Esta acción cancelará la propuesta y no podrá ser aprobada
                posteriormente. Indique el motivo del rechazo.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="py-2">
              <Textarea
                placeholder="Ej: Presupuesto excedido, cliente desistió..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="rounded-xl border-slate-200 focus-visible:ring-rose-500 min-h-[100px] text-sm font-medium"
              />
            </div>

            <AlertDialogFooter className="mt-4 flex sm:justify-center gap-3">
              <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] w-full mt-0">
                Cancelar
              </AlertDialogCancel>
              <Button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black text-white uppercase text-[10px] w-full"
              >
                {isRejecting ? (
                  <Loader2 className="animate-spin mr-2" size={14} />
                ) : (
                  "Confirmar Rechazo"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
