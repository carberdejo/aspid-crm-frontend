"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Phone,
  Briefcase,
  Save,
  Loader2,
  Mail,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { countryList } from "@/lib/utils/phone-utils";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useCreateContact } from "@/hooks";
import { ContactFormValues, contactSchema } from "@/lib/schemas/contact";
import { ClientAndContactResponseCreate, Contact } from "@/interfaces";

interface ContactFormProps {
  clientId: number;
  onSuccess: (data?: ClientAndContactResponseCreate<Contact>) => void;
}

export function ContactForm({ clientId, onSuccess }: ContactFormProps) {
  const { mutate, isPending } = useCreateContact();

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      position: "",
      phone: "",
      countryIso: "PE", // Por defecto Perú
      countryCode: "51",
      clientId: Number(clientId),
      email: "",
    } as ContactFormValues,
  });

  const onSubmit = (values: ContactFormValues) => {
    // Limpiamos el objeto antes de enviar (quitamos countryIso si el backend no lo espera)
    const { countryIso, ...dataToSubmit } = values;

    mutate(dataToSubmit, {
      onSuccess: (res) => onSuccess(res),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-2">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Nombre
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej. Carlos"
                    {...field}
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Apellido
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej. Berdejo"
                    {...field}
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Cargo y Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase leading-none">
                  Cargo
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Ej. Gerente TI"
                      {...field}
                      className="h-11 pl-10 border-gray-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase leading-none">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="gerente@empresa.com"
                      {...field}
                      className="h-11 pl-10 border-gray-200"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECCIÓN DE TELÉFONO (WA.ME COMPATIBLE) */}
        <div className="space-y-2">
          <FormLabel className="text-xs font-bold text-gray-700 uppercase">
            Teléfono Directo (WhatsApp)
          </FormLabel>
          <div className="flex gap-2">
            {/* Selector de Prefijo */}
            <FormField
              control={form.control}
              name="countryIso"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[100px] h-11 justify-between border-gray-200 bg-gray-50/50 font-bold",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? `+${countryList.find((c) => c.iso === field.value)?.code}`
                            : "+??"}
                          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Buscar país..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No hallado.</CommandEmpty>
                          <CommandGroup className="max-h-[250px] overflow-y-auto">
                            {countryList.map((country) => (
                              <CommandItem
                                key={country.iso}
                                // Normalizamos para búsqueda por nombre sin tildes
                                value={(country.name ?? "")
                                  .normalize("NFD")
                                  .replace(/[\u0300-\u036f]/g, "")
                                  .toLowerCase()}
                                onSelect={() => {
                                  form.setValue("countryIso", country.iso);
                                  form.setValue("countryCode", country.code);
                                  form.trigger("phone");
                                }}
                                className="flex items-center justify-between py-3 cursor-pointer"
                              >
                                <span className="text-[11px] font-bold uppercase">
                                  {country.name}
                                </span>
                                <span className="text-[10px] font-black text-secondary-text">
                                  +{country.code}
                                </span>
                                <Check
                                  className={cn(
                                    "h-4 w-4 text-secondary-text",
                                    field.value === country.iso
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Input del Número */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="999 999 999"
                        {...field}
                        className="h-11 pl-10 border-gray-200 font-bold"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold uppercase" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSuccess()}
            className="font-bold text-gray-500"
          >
            CANCELAR
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-secondary hover:bg-secondary-dark text-primary px-8 h-12 rounded-lg font-black shadow-lg active:scale-95 gap-2 transition-all"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            GUARDAR CONTACTO
          </Button>
        </div>
      </form>
    </Form>
  );
}
