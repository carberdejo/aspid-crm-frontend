"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  UserPlus,
  FileText,
  Hash,
  DollarSign,
  Tag,
} from "lucide-react";
import { useEffect } from "react";

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
import { QuoteFormValues, quoteSchema } from "@/lib/schemas/quote";
import { ClientSearchSelector } from "@/components/shared/ClientSearchSelector";
import { ContactSearchSelector } from "@/components/shared/ContactSearchSelector";

interface Props {
  departmentId: number;
  userId: number;
  onNewClient: () => void;
  onNewContact: () => void;
  onSubmit: (values: QuoteFormValues) => void;
  isLoading: boolean;
  newClientId?: string;
  newContactId?: string;
  onNewClientProcessed?: () => void;
  onNewContactProcessed?: () => void;
  onClientChange?: (clientId: string) => void;
}

export function QuoteForm({
  departmentId,
  userId,
  onNewClient,
  onNewContact,
  onSubmit,
  isLoading,
  newClientId,
  newContactId,
  onNewClientProcessed,
  onNewContactProcessed,
  onClientChange,
}: Props) {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      quoteNumber: "",
      userId: userId,
      clientId: "",
      contactId: "",
      departmentId: departmentId,
      amount: 0,
      type: "",
      orderType: "",
      description: "",
    },
  });

  const selectedClientId = useWatch({
    control: form.control,
    name: "clientId",
  });

  // Sincronización de nuevo Cliente (Reutilizado de VisitForm)
  useEffect(() => {
    if (newClientId) {
      form.setValue("clientId", newClientId, {
        shouldValidate: true,
        shouldDirty: true,
      });
      onClientChange?.(newClientId);
      setTimeout(() => onNewClientProcessed?.(), 500);
    }
  }, [newClientId]);

  // Sincronización de nuevo Contacto
  useEffect(() => {
    if (newContactId) {
      form.setValue("contactId", newContactId, { shouldValidate: true });
      onNewContactProcessed?.();
    }
  }, [newContactId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* FILA 1: NÚMERO Y CLIENTE */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <FormField
            control={form.control}
            name="quoteNumber"
            render={({ field }) => (
              <FormItem className="md:col-span-4 space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Hash size={12} /> Nº Cotización
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: COT-2026-001"
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:ring-secondary font-bold"
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="md:col-span-6 space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Cliente
                </FormLabel>
                <FormControl>
                  <ClientSearchSelector
                    value={field.value}
                    onChange={field.onChange}
                    onClientChange={onClientChange}
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={onNewClient}
              className="w-full h-14 rounded-2xl bg-[#1a2a53] hover:bg-[#111c38] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
              <UserPlus size={20} />
            </Button>
          </div>
        </div>

        {/* FILA 2: CONTACTO Y MONTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  Contacto{" "}
                  {selectedClientId && (
                    <span className="text-[8px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full animate-pulse">
                      Vinculado
                    </span>
                  )}
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <ContactSearchSelector
                      clientId={Number(selectedClientId)}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!selectedClientId}
                    />
                  </FormControl>
                  {selectedClientId && (
                    <Button
                      type="button"
                      onClick={onNewContact}
                      variant="outline"
                      className="h-14 rounded-2xl border-2 border-primary text-primary font-bold px-4"
                    >
                      <UserPlus size={16} />
                    </Button>
                  )}
                </div>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <DollarSign size={12} /> Monto Total
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 text-xl font-black text-primary"
                  />
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* FILA 3: TIPOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Tag size={12} /> Tipo de Cotización
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: Servicios, Productos..."
                    className="h-14 rounded-2xl border-slate-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem className="space-y-2 text-left">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <FileText size={12} /> Tipo de Orden
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: Directa, Licitación..."
                    className="h-14 rounded-2xl border-slate-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* DESCRIPCIÓN */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2 text-left">
              <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Descripción del Proyecto
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[120px] rounded-[2rem] border-slate-200 bg-slate-50/50 p-6 resize-none focus:ring-secondary"
                />
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 px-12 rounded-2xl bg-secondary hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs flex gap-3 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Generar Cotización
          </Button>
        </div>
      </form>
    </Form>
  );
}
