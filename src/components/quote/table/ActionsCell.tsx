import { Button } from "@/components/ui/button";
import { useQuoteDetail, useQuotes } from "@/hooks/quote/useQuotes";
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
  FileText,
  Edit3,
  Trash2,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Quote, QuoteCreateDto, QuoteStatus } from "@/interfaces";
import { useRouter } from "next/navigation";
import { QuoteFormValues } from "@/lib/schemas/quote";
import { RegisterPurchaseOrderModal } from "@/components/orders/form/RegisterPurchaseOrderModal";

export const ActionsCell = ({ quote }: { quote: Quote }) => {
  const router = useRouter();
  // Estados para modales
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: fullQuote, isLoading: isLoadingDetail } = useQuoteDetail(
    isEditOpen ? quote.id : undefined,
  );

  const { updateQuote, isUpdating, rejectQuote, isRejecting } = useQuotes();

  // Handler para Actualizar
  const handleUpdate = async (values: Partial<QuoteFormValues>) => {
    console.log("Datos enviados al actualizar:", values); // Paso 1: Ver si la función se dispara
    try {
      updateQuote({
        id: quote.id,
        data: {
          ...values,
          clientId: Number(values.clientId),
          contactId: Number(values.contactId),
          userId: Number(quote.userId),
          createdAt: values.createdAt ? new Date(values.createdAt) : undefined,
        } as QuoteCreateDto,
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error en la petición de update:", error);
    }
  };

  // Handler para Rechazar
  const handleReject = async () => {
    try {
      await rejectQuote({
        id: quote.id,
        reason: { statusReason: rejectReason },
      });
      setIsRejectOpen(false);
    } catch (error) {}
  };

  // Función para navegar al detalle dinámico
  const handleGoToDetail = () => {
    router.push(`/department/${quote.departmentId}/quote/${quote.id}`);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {quote.status === QuoteStatus.PENDIENTE && (
        <RegisterPurchaseOrderModal
          initialQuote={quote}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all group"
              title="Generar Orden de Compra"
            >
              <ShoppingCart
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
            </Button>
          }
        />
      )}
      {/* 1. VER DETALLE (Icono directo) */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-primary rounded-full"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {/* 2. DESCARGAR PDF */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-secondary rounded-full"
      >
        <FileText size={16} />
      </Button> */}

      {/* 3. EDITAR (Dialog con Formulario) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-blue-600"
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

          {/* 2. Mostramos un Loader mientras traemos los datos completos del servidor */}
          {isLoadingDetail ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Cargando información completa...
              </span>
            </div>
          ) : (
            <QuoteForm
              key={fullQuote?.id} // Clave para resetear el formulario al cambiar de cotización
              departmentId={fullQuote?.departmentId || 0}
              //   userId={quote.userId}
              isLoading={isUpdating}
              onSubmit={handleUpdate}
              // 3. Pasamos el 'fullQuote' que tiene todos los campos de la BD
              defaultValues={{
                ...fullQuote,
                quoteNumber: fullQuote?.quoteNumber ?? "",
                description: fullQuote?.description ?? "",
                amount: fullQuote?.amount ?? 0,
                clientId: fullQuote?.clientId ? String(fullQuote.clientId) : "",
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

      {/* 4. RECHAZAR (AlertDialog con Motivo) */}
      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 rounded-full"
            title="Rechazar Cotización"
          >
            <Trash2 size={16} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[2rem] p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-primary uppercase">
              Rechazar Cotización
            </AlertDialogTitle>
            <AlertDialogDescription>
              Indique el motivo del rechazo para el registro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Motivo..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px]">
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleReject}
              disabled={isRejecting || !rejectReason.trim()}
              className="bg-rose-600 hover:bg-rose-700 rounded-xl font-black text-white uppercase text-[10px]"
            >
              {isRejecting && (
                <Loader2 className="animate-spin mr-2" size={14} />
              )}
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
