"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { SegmentFormValues, segmentSchema } from "@/lib/schemas/segment.schema";
import { useCreateIndustrySegment, useUpdateIndustrySegment } from "@/hooks";
import { IndustrySegmentUpdateDto } from "@/interfaces/industry-segment.interface";

interface SegmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment?: IndustrySegmentUpdateDto | null; // Si viene null, es modo Crear. Si trae datos, es modo Editar.
}

export function SegmentFormDialog({
  open,
  onOpenChange,
  segment,
}: SegmentFormDialogProps) {
  const { createSegment, isCreating } = useCreateIndustrySegment();
  const { updateSegment, isUpdating } = useUpdateIndustrySegment();
  const isEditing = !!segment;
  const isProcessing = isCreating || isUpdating;
  //   console.log({ segment });
  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });

  // Efecto clave: Llena el formulario cuando abrimos en modo "Editar" y lo limpia al "Crear"
  useEffect(() => {
    if (segment && open) {
      form.reset({
        code: segment.code,
        name: segment.name,
      });
    } else if (!segment && open) {
      form.reset({
        code: "",
        name: "",
      });
    }
  }, [segment, open, form]);

  const onSubmit = (values: SegmentFormValues) => {
    if (isEditing) {
      updateSegment(
        { id: segment.id!, data: values },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      createSegment(values, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isEditing
              ? "Editar Segmento Industrial"
              : "Nuevo Segmento Industrial"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del rubro. Los cambios se reflejarán en las carteras de clientes."
              : "Registra un nuevo rubro industrial para la clasificación de empresas."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                    Código del Segmento
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. MI"
                      className="h-11 font-mono uppercase"
                      // UX Tip: Forzamos la mayúscula visualmente y en el valor
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                    Nombre del Segmento
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej. Minería"
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-bold text-gray-500"
                disabled={isProcessing}
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                disabled={isProcessing}
                className="bg-primary hover:bg-primary/90 text-white font-black px-6"
              >
                {isProcessing
                  ? "PROCESANDO..."
                  : isEditing
                    ? "GUARDAR CAMBIOS"
                    : "REGISTRAR SEGMENTO"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
