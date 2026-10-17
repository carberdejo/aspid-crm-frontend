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
import { VisitCreateDto, VisitListItem } from "@/interfaces/visit.interface";
import { useRouter } from "next/navigation";
import { useCanModify, useDeleteVisit, useUpdateVisit } from "@/hooks";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { VisitFormValues } from "@/lib/schemas/visit";
import { VisitForm } from "../VisitForm";

export const ActionsCellVisit = ({ visit }: { visit: VisitListItem }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Solo el dueño de la visita o un admin pueden editarla o eliminarla
  const canModify = useCanModify(visit.userId);
  const updateVisit = useUpdateVisit();
  const deleteVisit = useDeleteVisit();

  const handleGoToDetail = () => {
    router.push(`/department/${visit.departmentId}/visit/${visit.id}`);
  };

  const handleUpdate = (values: VisitFormValues) => {
    const data: Partial<VisitCreateDto> = {
      clientId: Number(values.clientId),
      contactId: Number(values.contactId),
      date: new Date(values.date),
      visitTopics: values.visitTopics,
      outcomeSummary: values.outcomeSummary,
      // El backend solo acepta el cambio de responsable de un admin
      ...(values.userId && { userId: Number(values.userId) }),
    };
    updateVisit.mutate(
      { id: Number(visit.id), data },
      { onSuccess: () => setIsEditOpen(false) },
    );
  };

  const handleDelete = () => {
    deleteVisit.mutate(Number(visit.id), {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 1. VER DETALLE */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors shrink-0"
        onClick={handleGoToDetail}
        title="Ver Detalle de Visita"
      >
        <Eye size={16} />
      </Button>

      {canModify && (
        <>
          {/* 2. EDITAR */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors shrink-0"
            title="Editar Visita"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3 size={16} />
          </Button>

          {/* 3. ELIMINAR */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0"
            title="Eliminar Visita"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={16} />
          </Button>
        </>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] p-8">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <DialogTitle className="text-3xl font-black text-primary uppercase tracking-tighter">
              Editar <span className="text-secondary">Visita</span>
            </DialogTitle>
          </DialogHeader>

          {/* Se monta solo al abrir: así toma los datos actuales de la fila */}
          {isEditOpen && (
            <VisitForm
              departmentId={Number(visit.departmentId)}
              onSubmit={handleUpdate}
              isLoading={updateVisit.isPending}
              clientLabel={visit.client?.commercialName}
              defaultValues={{
                userId: String(visit.userId),
                clientId: String(visit.clientId),
                contactId: visit.contactId ? String(visit.contactId) : "",
                departmentId: Number(visit.departmentId),
                date: String(visit.date).slice(0, 10),
                visitTopics: visit.visitTopics ?? "",
                outcomeSummary: visit.outcomeSummary ?? "",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="¿Eliminar visita?"
        description="La visita dejará de aparecer en los listados y en las métricas. Esta acción no se puede deshacer desde el sistema."
        onConfirm={handleDelete}
        isLoading={deleteVisit.isPending}
        variant="destructive"
      />
    </div>
  );
};
