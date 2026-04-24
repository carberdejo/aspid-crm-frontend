'use client';

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterContactModal } from "..";
import { RegisterClientModal } from "../client/RegisterClientModal";
import { RegisterVisitModal } from "./RegisterVisitModal";
import { useVisits } from "@/hooks/useVisits";
import { useAuthStore } from "@/store/useAuthStore";
import { VisitCreateDto } from "@/interfaces/visit.interface";
import { ClientAndContactResponseCreate, ClienteCreateResponseItem, ClientListItem, Contact } from "@/interfaces/client.interface";
import { VisitFormValues } from "@/lib/schemas/visit";
import { useVisitFlowStore } from "@/store";
import { PaginatedResponse } from "@/interfaces";

export function VisitFlowContainer({ trigger, departmentId }: { trigger: React.ReactNode, departmentId: number }) {
  const { activeModal, openMain, closeAll, backToMain, setNewClientId, setNewContactId, setSelectedClientId, selectedClientId, newClientId } = useVisitFlowStore();
  const { user } = useAuthStore();
  const { useCreateVisits } = useVisits();
  const createVisitMutation = useCreateVisits();
  const queryClient = useQueryClient();

  const handleClientCreated = useCallback((newClient: ClienteCreateResponseItem) => {
    queryClient.setQueryData(['clients', { limit: 10, name: "" }], (old: PaginatedResponse<ClientListItem>) => {
      if (!old) return { items: [newClient], total: 1 };
      return { ...old, items: [newClient, ...old.items], total: (old.total || 0) + 1 };
    });
    const newId = String(newClient.id);
    setNewClientId(newId);
    setSelectedClientId(newId);
    backToMain();
  }, [queryClient, setNewClientId, setSelectedClientId, backToMain]);

 const handleContactCreated = useCallback((response: ClientAndContactResponseCreate<Contact>) => {
    const newContact = response.item;
    const targetClientId = selectedClientId ? Number(selectedClientId) : (newClientId ? Number(newClientId) : undefined);

    if (targetClientId) {
      console.log("🚩 [FLOW] Inyectando contacto en caché para el cliente:", targetClientId);

      queryClient.setQueryData(['contacts-client', targetClientId], (old: Contact[]) => {
        if (!old) return [newContact]; 
        console.log({data: [...old,newContact]})
        return [...old, newContact];
      });

      queryClient.invalidateQueries({ queryKey: ['contacts-client', targetClientId] });
    }

    // 3. Mandamos el ID a Zustand y cerramos el modal
    setNewContactId(String(newContact.id));
    backToMain();
  }, [selectedClientId, newClientId, queryClient, setNewContactId, backToMain]);

  const handleVisitSubmit = useCallback((formData: VisitFormValues) => {
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
    createVisitMutation.mutate(visitData,{
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ['visits', { departmentId }] });
        console.log("✅ Visita registrada con éxito");
        closeAll();
      }
    });
  }, [user, departmentId, createVisitMutation]);

  return (
    <>
      <div onClick={openMain} className="w-fit">{trigger}</div>

      {/* Modal Principal: Se mantiene abierto mientras haya cualquier modal activo */}
      <RegisterVisitModal 
        isOpen={activeModal !== null} 
        onOpenChange={(open) => !open && closeAll()}
        departmentId={departmentId}
        onSubmit={handleVisitSubmit}
        isLoading={createVisitMutation.isPending}
      />

      <RegisterClientModal 
        isOpen={activeModal === 'CLIENT'} 
        onOpenChange={(open) => !open ? backToMain() : null}
        onSuccess={handleClientCreated}
        showTrigger={false}
      />

      <RegisterContactModal 
        isOpen={activeModal === 'CONTACT'} 
        onOpenChange={(open) => !open ? backToMain() : null}
        clientId={selectedClientId ? Number(selectedClientId) : (newClientId ? Number(newClientId) : undefined)}
        onSuccess={handleContactCreated}
        showTrigger={false}
      />
    </>
  );
}