"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, Save, UserPlus } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VisitFormValues, visitSchema } from "@/lib/schemas/visit";
import { ClientSearchSelector } from "../shared/ClientSearchSelector";
import { ContactSearchSelector } from "../shared/ContactSearchSelector";
import { UserSelect } from "../shared/UserSelect";
import { useVisitFlowStore } from "@/store";
import { useRecordOwner } from "@/hooks";

interface Props {
  departmentId: number;
  onSubmit: (values: VisitFormValues) => void;
  isLoading: boolean;
}

export function VisitForm({ departmentId, onSubmit, isLoading }: Props) {
  const openClient = useVisitFlowStore((state) => state.openClient);
  const openContact = useVisitFlowStore((state) => state.openContact);
  const setSelectedClientId = useVisitFlowStore(
    (state) => state.setSelectedClientId,
  );

  const { isAdmin, currentUserId, members, isLoadingMembers } =
    useRecordOwner(departmentId);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      userId: currentUserId,
      clientId: "",
      contactId: "",
      departmentId: departmentId,
      date: new Date().toISOString().split("T")[0],
      visitTopics: "",
      outcomeSummary: "",
    },
  });

  const selectedClientId = useWatch({
    control: form.control,
    name: "clientId",
  });

  const ownerId = useWatch({ control: form.control, name: "userId" });

  // El cliente debe ser de las carteras del responsable: al cambiarlo se limpia la selección
  const handleOwnerChange = (value: string) => {
    form.setValue("userId", value);
    form.setValue("clientId", "");
    form.setValue("contactId", "");
    setSelectedClientId(undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {isAdmin && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Responsable
                </FormLabel>
                <FormControl>
                  <UserSelect
                    members={members}
                    value={field.value}
                    onChange={handleOwnerChange}
                    isLoading={isLoadingMembers}
                    placeholder="Seleccione el responsable"
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        )}

        <div className="flex flex-col md:flex-row items-end gap-4 w-full">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="flex-1 space-y-2 text-left min-w-0">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Cliente
                </FormLabel>
                <FormControl>
                  <ClientSearchSelector
                    value={field.value}
                    onChange={field.onChange}
                    onClientChange={setSelectedClientId}
                    userId={isAdmin && ownerId ? Number(ownerId) : undefined}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          {/* <Button 
            type="button" 
            onClick={openClient}
            className="shrink-0 h-14 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold flex gap-2 shadow-lg shadow-blue-900/10 active:scale-95 transition-all"
          >
            <UserPlus size={18} />
            <span className="uppercase tracking-widest text-[10px]">Registrar Cliente</span>
          </Button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left min-w-0">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Contacto
                </FormLabel>
                <div className="flex gap-2 w-full items-center">
                  {/* Contenedor flexible para el input para que no empuje al botón */}
                  <div className="flex-1 min-w-0">
                    <FormControl>
                      <ContactSearchSelector
                        clientId={Number(selectedClientId)}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!selectedClientId}
                      />
                    </FormControl>
                  </div>

                  {selectedClientId && (
                    <Button
                      type="button"
                      onClick={openContact}
                      // Añadimos shrink-0 para que el botón mantenga su tamaño original
                      className="shrink-0 h-14 px-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest flex gap-2"
                      variant="outline"
                    >
                      <UserPlus size={14} />
                      <span className="hidden xl:inline">Nuevo</span>
                    </Button>
                  )}
                </div>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left min-w-0">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Fecha
                </FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type="date"
                      {...field}
                      // Magia de CSS para ocultar el icono nativo pero mantener la zona clickeable
                      className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 pr-10 focus:ring-secondary relative z-10 
                                 [&::-webkit-calendar-picker-indicator]:opacity-0 
                                 [&::-webkit-calendar-picker-indicator]:absolute 
                                 [&::-webkit-calendar-picker-indicator]:inset-0 
                                 [&::-webkit-calendar-picker-indicator]:w-full 
                                 [&::-webkit-calendar-picker-indicator]:h-full 
                                 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <Calendar
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-0"
                      size={18}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="visitTopics"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Temas tratados
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 resize-none focus:ring-secondary"
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outcomeSummary"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Resumen
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 resize-none focus:ring-secondary"
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 px-12 rounded-2xl bg-secondary hover:bg-orange-500 text-white font-black uppercase tracking-widest text-xs flex gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Guardar Registro
          </Button>
        </div>
      </form>
    </Form>
  );
}
