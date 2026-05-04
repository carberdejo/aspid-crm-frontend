"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterQuoteModal } from "./RegisterQuoteModal";
import { useQuotes } from "@/hooks/useQuotes"; // Tu hook actualizado
import { useAuthStore } from "@/store/useAuthStore";
import { QuoteFormValues } from "@/lib/schemas/quote";
import { useVisitFlowStore } from "@/store";
import {
  ClienteCreateResponseItem,
  Contact,
  ClientAndContactResponseCreate,
  ClientListItem,
} from "@/interfaces/client.interface";
import { PaginatedResponse, QuoteCreateDto } from "@/interfaces";
import { RegisterClientModal } from "@/components/client/form/RegisterClientModal";
import { RegisterContactModal } from "@/components/client/form/RegisterContactModal";

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
  const handleClientCreated = useCallback(
    (newClient: ClienteCreateResponseItem) => {
      queryClient.setQueryData(
        ["clients", { limit: 10, name: "" }],
        (old: PaginatedResponse<ClientListItem>) => {
          if (!old) return { items: [newClient], total: 1 };
          return {
            ...old,
            items: [newClient, ...old.items],
            total: (old.total || 0) + 1,
          };
        },
      );
      const newId = String(newClient.id);
      setNewClientId(newId);
      setSelectedClientId(newId);
      backToMain();
    },
    [queryClient, setNewClientId, setSelectedClientId, backToMain],
  );

  const handleContactCreated = useCallback(
    (response: ClientAndContactResponseCreate<Contact>) => {
      const newContact = response.item;
      const targetClientId = selectedClientId
        ? Number(selectedClientId)
        : newClientId
          ? Number(newClientId)
          : undefined;

      if (targetClientId) {
        queryClient.setQueryData(
          ["contacts-client", targetClientId],
          (old: Contact[]) => {
            if (!old) return [newContact];
            return [...old, newContact];
          },
        );
        queryClient.invalidateQueries({
          queryKey: ["contacts-client", targetClientId],
        });
      }

      setNewContactId(String(newContact.id));
      backToMain();
    },
    [selectedClientId, newClientId, queryClient, setNewContactId, backToMain],
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
        // collaboratorId: formData.collaboratorId,
        departmentId: departmentId, // Ahora el hook "escuchará" cuando este valor cambie
        clientId: +formData.clientId,
        contactId: +formData.contactId,
        userId: user.sub,
        createdAt: new Date(formData.createdAt), // Convertir a Date (asegura el tipo correcto)
      };
      console.log("data de quote: ", { quoteData });
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
        onNewClient={() => useVisitFlowStore.getState().openClient()}
        onNewContact={() => useVisitFlowStore.getState().openContact()}
        newClientId={newClientId}
        newContactId={newContactId}
        onClientChange={(id) => setSelectedClientId(id)}
      />

      <RegisterClientModal
        isOpen={activeModal === "CLIENT"}
        onOpenChange={(open) => (!open ? backToMain() : null)}
        onSuccess={handleClientCreated}
        showTrigger={false}
      />

      <RegisterContactModal
        isOpen={activeModal === "CONTACT"}
        onOpenChange={(open) => (!open ? backToMain() : null)}
        clientId={
          selectedClientId
            ? Number(selectedClientId)
            : newClientId
              ? Number(newClientId)
              : undefined
        }
        onSuccess={handleContactCreated}
        showTrigger={false}
      />
    </>
  );
}
