"use client";

import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
import { useCreateDelivery } from "@/hooks";
import {
  createDeliverySchema,
  CreateDeliveryValues,
} from "@/lib/schemas/delivery.schema";
import { ClientSearchSelector } from "..";
import { useAuthStore } from "@/store";
import { DeliveryCreateDto } from "@/interfaces";

interface DeliveryFormProps {
  onSuccess: () => void;
}

export function DeliveryForm({ onSuccess }: DeliveryFormProps) {
  const userId = useAuthStore((state) => state.user?.sub);
  const { createDelivery, isCreating } = useCreateDelivery();

  const form = useForm<CreateDeliveryValues>({
    resolver: zodResolver(
      createDeliverySchema,
    ) as Resolver<CreateDeliveryValues>,
    defaultValues: {
      clientId: undefined,
      deliveryDate: new Date().toISOString().split("T")[0],
      deliveryItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryItems",
  });

  const onSubmit = (data: CreateDeliveryValues) => {
    const payload: DeliveryCreateDto = {
      ...data,
      clientId: data.clientId ? Number(data.clientId) : 0,
      userId: userId ? Number(userId) : 0,
    };

    createDelivery(payload, {
      onSuccess: () => {
        form.reset();
        onSuccess(); // Solo ejecutamos el callback para avisar que terminó
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
        {/* Bloque de Datos Generales */}
        <div className="bg-muted/30 p-5 rounded-xl border border-dashed border-gray-300">
          <FormLabel className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
            Paso 1: Datos de la Entrega
          </FormLabel>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                // AÑADIMOS: md:col-span-2 para que tome todo el ancho
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                    Empresa / Cliente (Opcional)
                  </FormLabel>
                  <FormControl>
                    <ClientSearchSelector
                      value={field.value ? String(field.value) : ""}
                      onChange={(val) =>
                        field.onChange(val ? Number(val) : undefined)
                      }
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                    Fecha de Entrega
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="h-11 border-gray-200"
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bloque de Ítems (JSONB) */}
        <div className="bg-muted/30 p-5 rounded-xl border border-dashed border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <FormLabel className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Paso 2: Productos (Opcional)
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ producto: "", cantidad: 1 })}
              className="h-8 text-xs font-bold text-gray-600 border-gray-200"
              disabled={isCreating}
            >
              <Plus size={14} className="mr-1" /> Añadir
            </Button>
          </div>

          {fields.length === 0 && (
            <div className="text-center py-6 bg-white border border-gray-100 rounded-lg">
              <p className="text-xs font-medium text-gray-400">
                Sin productos. Solo se registrará la entrega general.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
              >
                <FormField
                  control={form.control}
                  name={`deliveryItems.${index}.producto`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Descripción..."
                          className="h-10 border-gray-200"
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`deliveryItems.${index}.cantidad`}
                  render={({ field }) => (
                    <FormItem className="w-24 shrink-0">
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          className="h-10 border-gray-200 font-mono text-center"
                          disabled={isCreating}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                  disabled={isCreating}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSuccess()} // Gatillamos el cierre manual al cancelar
            className="font-bold text-gray-500 h-12 px-6"
            disabled={isCreating}
          >
            CANCELAR
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="bg-secondary hover:bg-secondary/90 text-white px-10 h-12 rounded-lg font-black transition-all shadow-md active:scale-95"
          >
            {isCreating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                PROCESANDO...
              </>
            ) : (
              "REGISTRAR ENTREGA"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
