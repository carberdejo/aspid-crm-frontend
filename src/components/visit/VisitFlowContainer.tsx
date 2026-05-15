"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterContactModal } from "..";
import { RegisterClientModal } from "../client/form/RegisterClientModal";
import { RegisterVisitModal } from "./RegisterVisitModal";
import { useVisits } from "@/hooks/visit/useVisits";
import { useAuthStore } from "@/store/useAuthStore";
import { VisitCreateDto } from "@/interfaces/visit.interface";
import {
  ClientAndContactResponseCreate,
  ClienteCreateResponseItem,
  ClientListItem,
  Contact,
} from "@/interfaces/client.interface";
import { VisitFormValues } from "@/lib/schemas/visit";
import { useVisitFlowStore } from "@/store";
import { PaginatedResponse } from "@/interfaces";
import { clientQueryKeys, contactQueryKeys } from "@/lib/queryKeys";

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
    // setNewClientId,
    setNewContactId,
    setSelectedClientId,
    selectedClientId,
    // newClientId,
  } = useVisitFlowStore();
  const { user } = useAuthStore();
  const { useCreateVisits } = useVisits();
  const createVisitMutation = useCreateVisits();
  const queryClient = useQueryClient();

  // const handleClientCreated = useCallback(
  //   (newClient: ClienteCreateResponseItem) => {
  //     // ✅ USA QUERY KEY NORMALIZADA
  //     queryClient.setQueryData(
  //       clientQueryKeys.list({ term: "", limit: 10 }),
  //       (old: PaginatedResponse<ClientListItem>) => {
  //         if (!old) return { items: [newClient], total: 1 };
  //         return {
  //           ...old,
  //           items: [newClient, ...old.items],
  //           total: (old.total || 0) + 1,
  //         };
  //       },
  //     );

  //     // ✅ También invalida la lista completa para refetch si es necesario
  //     queryClient.invalidateQueries({
  //       queryKey: clientQueryKeys.all,
  //     });

  //     const newId = String(newClient.id);
  //     setNewClientId(newId);
  //     setSelectedClientId(newId);
  //     backToMain();
  //   },
  //   [queryClient, setNewClientId, setSelectedClientId, backToMain],
  // );

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
          // queryClient.invalidateQueries({ queryKey: ['visits', { departmentId }] });
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

      {/* <RegisterClientModal
        isOpen={activeModal === "CLIENT"}
        onOpenChange={(open) => (!open ? backToMain() : null)}
        onSuccess={handleClientCreated}
        showTrigger={false}
      /> */}

      <RegisterContactModal
        isOpen={activeModal === "CONTACT"}
        onOpenChange={(open) => (!open ? backToMain() : null)}
        clientId={
          // selectedClientId
          //   ? Number(selectedClientId)
          //   : newClientId
          //     ? Number(newClientId)
          //     : undefined
          Number(selectedClientId)
        }
        onSuccess={handleContactCreated}
        showTrigger={false}
      />
    </>
  );
}
