"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { Delivery } from "@/interfaces"; // Ajusta a la ruta real de tus interfaces
import { useParams, useRouter } from "next/navigation";
import { useCanModify, useDeleteDelivery } from "@/hooks";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DeliveryForm } from "./DeliveryForm";

interface ActionsCellDeliveryProps {
  delivery: Delivery;
}

export const ActionsCellDelivery = ({ delivery }: ActionsCellDeliveryProps) => {
  const router = useRouter();
  const params = useParams();
  const departmentId = params.id;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Solo el dueño de la entrega o un admin pueden editarla o eliminarla
  const canModify = useCanModify(delivery.user?.id);
  const { deleteDelivery, isDeleting } = useDeleteDelivery();

  const handleGoToDetail = () => {
    // Ajusta esta ruta según la estructura de carpetas de logística/entregas
    router.push(`/department/${departmentId}/delivery/${delivery.id}`);
  };

  const handleDelete = () => {
    deleteDelivery(Number(delivery.id), {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE DIRECTO */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-emerald-600 rounded-full transition-colors shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      {canModify && (
        <>
          {/* 2. EDITAR */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 rounded-full transition-colors shrink-0"
            title="Editar Entrega"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3 size={16} />
          </Button>

          {/* 3. ELIMINAR */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0"
            title="Eliminar Entrega"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={16} />
          </Button>
        </>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[680px] p-0 overflow-hidden rounded-xl border-none shadow-2xl bg-white flex flex-col">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-200 rounded-full" />
              EDITAR ENTREGA
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 pt-0 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {/* Se monta solo al abrir: así toma los datos actuales de la fila */}
            {isEditOpen && (
              <DeliveryForm
                delivery={delivery}
                // Las entregas antiguas sin área usan el área de la página para los miembros
                departmentId={Number(delivery.departmentId ?? departmentId)}
                onSuccess={() => setIsEditOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="¿Eliminar entrega?"
        description="La entrega dejará de aparecer en los listados. Esta acción no se puede deshacer desde el sistema."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
};
