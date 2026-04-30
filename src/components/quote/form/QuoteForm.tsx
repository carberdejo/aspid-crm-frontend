"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  UserPlus,
  Hash,
  DollarSign,
  Tag,
  Briefcase,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QuoteFormValues, quoteSchema } from "@/lib/schemas/quote";
import { ClientSearchSelector } from "@/components/shared/ClientSearchSelector";
import { ContactSearchSelector } from "@/components/shared/ContactSearchSelector";
import { useVisitFlowStore } from "@/store";

const QUOTE_TYPES = ["PRODUCTO", "SERVICIO", "PROYECTO"];
const ORDER_TYPES = ["IMPORTACION", "STOCK", "ENTREGA_PARCIAL"];

interface QuoteFormProps {
  departmentId: number;
  // userId: number;
  onSubmit: (values: QuoteFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<QuoteFormValues>;
}

export function QuoteForm({
  departmentId,
  onSubmit,
  isLoading,
  defaultValues,
}: QuoteFormProps) {
  const openClient = useVisitFlowStore((state) => state.openClient);
  const openContact = useVisitFlowStore((state) => state.openContact);
  const setSelectedClientId = useVisitFlowStore(
    (state) => state.setSelectedClientId,
  );
  const newClientId = useVisitFlowStore((state) => state.newClientId);
  const newContactId = useVisitFlowStore((state) => state.newContactId);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: defaultValues || {
      quoteNumber: "",
      clientId: "",
      contactId: "",
      departmentId,
      amount: 0,
      type: "",
      orderType: "",
      description: "",
      createdAt: new Date().toISOString().split("T")[0], // Fecha por defecto hoy
    },
  });

  const selectedClientId = useWatch({
    control: form.control,
    name: "clientId",
  });

  useEffect(() => {
    if (newClientId) {
      form.setValue("clientId", newClientId, { shouldValidate: true });
      setSelectedClientId(newClientId);
    }
  }, [newClientId, form, setSelectedClientId]);

  useEffect(() => {
    if (newContactId) {
      form.setValue("contactId", newContactId, { shouldValidate: true });
    }
  }, [newContactId, form]);

  const { errors } = form.formState;

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Campos con errores:", errors);
    }
  }, [errors]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* SECCIÓN 1: DATOS DE CABECERA */}
        <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-end gap-4 w-full">
            <FormField
              control={form.control}
              name="quoteNumber"
              render={({ field }) => (
                <FormItem className="flex-[0.4] space-y-2 text-left min-w-0">
                  <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={12} /> Nº Cotización
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: COT-001"
                      className="h-14 rounded-2xl border-slate-200 bg-white font-bold focus:ring-secondary focus:border-secondary transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-2 text-left min-w-0">
                  <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Cliente
                  </FormLabel>
                  <FormControl>
                    <ClientSearchSelector
                      value={field.value}
                      onChange={field.onChange}
                      onClientChange={setSelectedClientId}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={openClient}
              className="shrink-0 h-14 px-8 rounded-2xl bg-[#1e293b] hover:bg-primary text-white font-bold flex gap-2 shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              <UserPlus size={18} />
              <span className="uppercase tracking-widest text-[10px]">
                Nuevo
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left min-w-0">
                  <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    Contacto{" "}
                    {selectedClientId && (
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                    )}
                  </FormLabel>
                  <div className="flex gap-2 w-full items-center">
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
                        className="shrink-0 h-14 px-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
                        variant="outline"
                      >
                        <UserPlus size={16} />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left">
                  <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <DollarSign size={12} /> Monto Neto (Sin IGV)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg italic">
                        S/
                      </span>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="h-14 pl-12 rounded-2xl border-slate-200 bg-white text-xl font-black text-primary focus:ring-secondary"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECCIÓN 2: CATEGORIZACIÓN Y FECHA (3 COLUMNAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="text-left space-y-2">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag size={12} /> Tipo
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-white font-bold text-primary focus:border-secondary focus:ring-0 transition-all px-6">
                      <SelectValue placeholder="Seleccione Tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {QUOTE_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="font-bold text-[11px] uppercase py-3 focus:bg-secondary/10 focus:text-secondary cursor-pointer"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderType"
            render={({ field }) => (
              <FormItem className="text-left space-y-2">
                <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Briefcase size={12} /> Orden
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-white font-bold text-primary focus:border-secondary focus:ring-0 transition-all px-6">
                      <SelectValue placeholder="Seleccione Orden" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {ORDER_TYPES.map((order) => (
                      <SelectItem
                        key={order}
                        value={order}
                        className="font-bold text-[11px] uppercase py-3 focus:bg-secondary/10 focus:text-secondary cursor-pointer"
                      >
                        {order.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
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

        {/* DESCRIPCIÓN */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="text-left space-y-2">
              <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Alcance y Observaciones
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[120px] rounded-[2rem] border-slate-200 bg-slate-50/50 p-6 resize-none focus:ring-secondary text-sm font-medium"
                  placeholder="Especifique detalles técnicos o condiciones comerciales..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-14 px-12 rounded-2xl bg-secondary hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] flex gap-3 shadow-xl shadow-orange-500/20 transition-all active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Finalizar Cotización
          </Button>
        </div>
      </form>
    </Form>
  );
}
