"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { useCreatePortfolio, useUpdatePortfolio, useUsers } from "@/hooks";
import {
  PortfolioFormValues,
  portfolioSchema,
} from "@/lib/schemas/portfolio.schema";
import { User } from "@/interfaces";
import {
  Portfolio,
  PortfolioType,
  PortfolioUser,
  PortfolioZone,
  RoleInPortfolio,
} from "@/interfaces/portfolio.interface";

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio?: Portfolio | null;
}

// HELPER PARA NORMALIZAR TEXTO (Mayúsculas y sin tildes)
const normalizeText = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

export function PortfolioFormDialog({
  open,
  onOpenChange,
  portfolio,
}: PortfolioFormDialogProps) {
  const { createPortfolio, isCreating } = useCreatePortfolio();
  const { isUpdating, updatePortfolio } = useUpdatePortfolio();
  const { users: availableUsers } = useUsers();

  const isEditing = !!portfolio;
  const isProcessing = isCreating || isUpdating;

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema) as Resolver<PortfolioFormValues>,
    defaultValues: {
      code: "",
      type: "",
      province: "",
      zone: "",
      users: [] as PortfolioFormValues["users"],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "users",
  });

  useEffect(() => {
    if (portfolio && open) {
      form.reset({
        code: portfolio.code,
        type: portfolio.type,
        province: portfolio.province || "",
        zone: portfolio.zone || "",
        users:
          portfolio.users?.map((u: PortfolioUser) => ({
            userId: Number(u.user.id),
            roleInPortfolio: u.roleInPortfolio,
          })) || [],
      });
    } else if (!portfolio && open) {
      form.reset({ code: "", type: "", province: "", zone: "", users: [] });
    }
  }, [portfolio, open, form]);

  const onSubmit = (values: PortfolioFormValues) => {
    if (isEditing) {
      updatePortfolio(
        { id: portfolio.id, data: values },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createPortfolio(values, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary font-bold text-2xl">
            {isEditing
              ? "Editar Cartera de Ingeniería"
              : "Nueva Cartera de Ingeniería"}
          </DialogTitle>
          <DialogDescription>
            Configura la zona geográfica y asigna el equipo responsable.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-4"
          >
            {/* Fila 1: Código y Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-500">
                      Código
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej. C5"
                        className="h-11 font-mono uppercase"
                        // FORZAR MAYÚSCULAS EN EL CÓDIGO
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-500">
                      Tipo de Cartera
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Seleccionar Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PortfolioType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fila 2: Provincia y Zona */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-500">
                      Provincia
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej. LIMA"
                        className="h-11 uppercase"
                        // APLICAR NORMALIZACIÓN (Mayúsculas y sin tildes)
                        onChange={(e) =>
                          field.onChange(normalizeText(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-gray-500">
                      Zona / Sector
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Seleccionar Zona" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PortfolioZone).map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SECCIÓN DINÁMICA: EQUIPO DE TRABAJO */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-secondary uppercase tracking-wider flex items-center gap-2">
                  <UserPlus size={18} /> Equipo Asignado
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      userId: 0,
                      roleInPortfolio: RoleInPortfolio.ING_PROYECTOS,
                    })
                  }
                  className="text-xs font-bold border-dashed border-2"
                >
                  <Plus size={14} className="mr-1" /> AGREGAR MIEMBRO
                </Button>
              </div>

              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                  No hay miembros asignados a esta cartera.
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border"
                  >
                    <FormField
                      control={form.control}
                      name={`users.${index}.userId`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={field.value ? field.value.toString() : ""}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Seleccionar Usuario" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableUsers.map((u: User) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {/* Mostrar nombres en MAYÚSCULAS si lo deseas, o dejarlo como viene */}
                                  {u.firstName.toUpperCase()}{" "}
                                  {u.lastName.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`users.${index}.roleInPortfolio`}
                      render={({ field }) => (
                        <FormItem className="w-[180px]">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Rol" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={RoleInPortfolio.RESPONSABLE}>
                                {RoleInPortfolio.RESPONSABLE}
                              </SelectItem>
                              <SelectItem value={RoleInPortfolio.ING_PROYECTOS}>
                                {RoleInPortfolio.ING_PROYECTOS}
                              </SelectItem>
                              <SelectItem value={RoleInPortfolio.SERVICIOS}>
                                {RoleInPortfolio.SERVICIOS}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
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
                className="bg-secondary hover:bg-secondary/90 text-white font-black px-8 h-11"
              >
                {isProcessing
                  ? "PROCESANDO..."
                  : isEditing
                    ? "ACTUALIZAR EQUIPO"
                    : "CREAR CARTERA"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
