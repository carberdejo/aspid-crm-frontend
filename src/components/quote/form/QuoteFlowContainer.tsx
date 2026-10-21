"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterQuoteModal } from "./RegisterQuoteModal";
import { useQuotes } from "@/hooks/quote/useQuotes"; // Tu hook actualizado
import { useAuthStore } from "@/store/useAuthStore";
import { QuoteFormValues } from "@/lib/schemas/quote";
import { useVisitFlowStore } from "@/store";
import {
  ClienteCreateResponseItem,
  Contact,
  ClientAndContactResponseCreate,
  ClientListItem,
} from "@/interfaces/client.interface";
import { PaginatedResponse, QuoteCreateDto, QuoteCurrency } from "@/interfaces";
import { RegisterClientModal } from "@/components/client/form/RegisterClientModal";
import { RegisterContactModal } from "@/components/client/form/RegisterContactModal";
import { clientQueryKeys, contactQueryKeys } from "@/lib/queryKeys";

export function QuoteFlowContainer({
  trigger,
  departmentId,
}: {
  trigger: React.ReactNode;
  departmentId: number;
}) {
  const {
    newContactId,
    activeModal,
    openMain,
    closeAll,
    backToMain,
    setNewClientId,
    setNewContactId,
    setSelectedClientId,
    selectedClientId,
    newClientId,
    flowType,
  } = useVisitFlowStore();

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Desestructuramos lo que tu hook retorna actualmente
  const { createQuote, isCreating } = useQuotes();

  // 1. Manejar creación de cliente
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
        // ✅ USA QUERY KEY NORMALIZADA
        queryClient.setQueryData(
          contactQueryKeys.byClient(targetClientId),
          (old: Contact[]) => {
            if (!old) return [newContact];
            return [...old, newContact];
          },
        );
      }

      setNewContactId(String(newContact.id));
      backToMain();
    },
    [selectedClientId, queryClient, setNewContactId, backToMain],
  );

  const handleQuoteSubmit = useCallback(
    async (formData: QuoteFormValues) => {
      if (!user) return;

      const quoteData: QuoteCreateDto = {
        quoteNumber: formData.quoteNumber,
        amount: formData.amount,
        type: formData.type,
        orderType: formData.orderType,
        description: formData.description,
        currency: (formData.currency as QuoteCurrency) || QuoteCurrency.USD, // Valor por defecto si no se selecciona ninguno
        // Colaborador opcional: el backend valida que sea del área y distinto del responsable
        collaboratorId: formData.collaboratorId
          ? Number(formData.collaboratorId)
          : undefined,
        departmentId: departmentId, // Ahora el hook "escuchará" cuando este valor cambie
        clientId: +formData.clientId,
        contactId: +formData.contactId,
        // Responsable elegido por el admin; si no, el usuario conectado
        userId: formData.userId ? Number(formData.userId) : user.sub,
        createdAt: new Date(formData.createdAt), // Convertir a Date (asegura el tipo correcto)
      };
      try {
        await createQuote(quoteData);
        closeAll();
      } catch (error) {
        console.error("Error en el submit:", error);
      }
    },
    // 💡 DEBES AGREGAR departmentId AQUÍ:
    [user, createQuote, closeAll, departmentId],
  );

  // Abrimos especificando el flujo de Cotización
  const handleOpen = () => openMain("QUOTE");

  return (
    <>
      <div onClick={handleOpen} className="w-fit">
        {trigger}
      </div>

      <RegisterQuoteModal
        isOpen={activeModal !== null && flowType === "QUOTE"}
        onOpenChange={(open) => !open && closeAll()}
        departmentId={departmentId}
        userId={user?.sub || 0}
        onSubmit={handleQuoteSubmit}
        isLoading={isCreating} // Usamos 'isCreating' de tu hook
        // onNewClient={() => useVisitFlowStore.getState().openClient()}
        // onNewContact={() => useVisitFlowStore.getState().openContact()}
        // newClientId={newClientId}
        // newContactId={newContactId}
        // onClientChange={(id) => setSelectedClientId(id)}
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
        clientId={Number(selectedClientId)}
        onSuccess={handleContactCreated}
        showTrigger={false}
      />
    </>
  );
}
