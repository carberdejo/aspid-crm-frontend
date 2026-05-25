"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterContactModal } from "..";
import { RegisterVisitModal } from "./RegisterVisitModal";
import { useVisits } from "@/hooks/visit/useVisits";
import { useAuthStore } from "@/store/useAuthStore";
import { VisitCreateDto } from "@/interfaces/visit.interface";
import {
  ClientAndContactResponseCreate,
  Contact,
} from "@/interfaces/client.interface";
import { VisitFormValues } from "@/lib/schemas/visit";
import { useVisitFlowStore } from "@/store";
import { contactQueryKeys } from "@/lib/queryKeys";

export function VisitFlowContainer({
  trigger,
  departmentId,
}: {
  trigger: React.ReactNode;
  departmentId: number;
}) {
  const {
    activeModal,
    flowType,
    openMain,
    closeAll,
    backToMain,
    setNewContactId,
    selectedClientId,
  } = useVisitFlowStore();
  const { user } = useAuthStore();
  const { useCreateVisits } = useVisits();
  const createVisitMutation = useCreateVisits();
  const queryClient = useQueryClient();

  const handleContactCreated = useCallback(
    (response: ClientAndContactResponseCreate<Contact>) => {
      const newContact = response.item;
      const targetClientId = Number(selectedClientId);

      if (targetClientId) {
        console.log(
          "🚩 [FLOW] Inyectando contacto en caché para el cliente:",
          targetClientId,
        );

        // ✅ USA QUERY KEY NORMALIZADA
        queryClient.setQueryData(
          contactQueryKeys.byClient(targetClientId),
          (old: Contact[]) => {
            if (!old) return [newContact];
            return [...old, newContact];
          },
        );
      }

      // 3. Mandamos el ID a Zustand y cerramos el modal
      setNewContactId(String(newContact.id));
      backToMain();
    },
    [selectedClientId, queryClient, setNewContactId, backToMain],
  );

  const handleVisitSubmit = useCallback(
    (formData: VisitFormValues) => {
      if (!user) return;
      const visitData: VisitCreateDto = {
        userId: user.sub,
        clientId: +formData.clientId,
        contactId: +formData.contactId,
        departmentId: departmentId,
        date: new Date(formData.date),
        visitTopics: formData.visitTopics,
        outcomeSummary: formData.outcomeSummary,
      };
      createVisitMutation.mutate(visitData, {
        onSuccess: () => {
          console.log("✅ Visita registrada con éxito");
          closeAll();
        },
      });
    },
    [user, departmentId, createVisitMutation, closeAll],
  );

  // Abrimos especificando el flujo de Visita
  const handleOpen = () => openMain("VISIT");
  return (
    <>
      <div onClick={handleOpen} className="w-fit">
        {trigger}
      </div>

      {/* Modal Principal: Se mantiene abierto mientras haya cualquier modal activo */}
      <RegisterVisitModal
        isOpen={activeModal !== null && flowType === "VISIT"}
        onOpenChange={(open) => !open && closeAll()}
        departmentId={departmentId}
        onSubmit={handleVisitSubmit}
        isLoading={createVisitMutation.isPending}
      />

      <RegisterContactModal
        isOpen={activeModal === "CONTACT"}
        onOpenChange={(open) => (!open ? backToMain() : null)}
        clientId={Number(selectedClientId)}
        onSuccess={handleContactCreated}
        showTrigger={false}
      />
    </>
  );
}
