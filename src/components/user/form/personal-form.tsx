"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalSchema, PersonalFormValues } from "@/lib/schemas/personal";
import {
  Eye,
  EyeOff,
  RefreshCcw,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

import { useUsers } from "@/hooks";
import { UserRole } from "@/interfaces";
import { useDepartmentStore } from "@/store";
import { countryList } from "@/lib";

export function PersonalForm({ onSuccess }: { onSuccess: () => void }) {
  const { createUser, isCreating } = useUsers();
  // const { useQueryDeparments } = useDepartment();
  const [showPassword, setShowPassword] = useState(false);

  // const departments = useQueryDeparments.data || [];
  const { departments } = useDepartmentStore();

  const form = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      codUser: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: UserRole.USER,
      departmentIds: [],
      password: "",
      country: "Peru",
      countryCode: "51",
      countryIso: "PE",
    } as PersonalFormValues,
  });

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-10) + "ASPID!";
    form.setValue("password", pass, { shouldValidate: true });
  };

  const onSubmit = (data: PersonalFormValues) => {
    // Desestructuramos para quitar countryIso antes de enviar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { countryIso, ...dataToSubmit } = data;

    // Enviamos al hook de creación
    createUser(dataToSubmit, {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      {/* Añadimos un padding inferior para que el último campo no pegue con los botones */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  NOMBRE
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej. Juan"
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
                <FormLabel className="text-sm font-semibold text-gray-700">
                  APELLIDO
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej. Pérez"
                    {...field}
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  EMAIL CORPORATIVO
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
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
            name="codUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  ID USUARIO
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="USR-0000"
                    className="h-11 bg-gray-50 border-gray-200 font-mono"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="departmentIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-semibold text-gray-700">
                DEPARTAMENTOS ASIGNADOS
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-auto min-h-11 justify-between border-gray-200 hover:bg-white",
                        !field.value.length && "text-muted-foreground",
                      )}
                    >
                      <div className="flex flex-wrap gap-2">
                        {field.value.length > 0
                          ? field.value.map((id: number) => (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="bg-gray-100 text-gray-800 border-none px-3 py-1"
                              >
                                {departments.find((d) => d.id === id)?.name}
                                <X
                                  className="ml-2 h-3 w-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(
                                      field.value.filter(
                                        (i: number) => i !== id,
                                      ),
                                    );
                                  }}
                                />
                              </Badge>
                            ))
                          : "Seleccionar departamentos..."}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar departamento..." />
                    <CommandList>
                      <CommandEmpty>No hallado.</CommandEmpty>
                      <CommandGroup>
                        {departments.map((dep) => (
                          <CommandItem
                            key={dep.id}
                            onSelect={() => {
                              const newValue = field.value.includes(dep.id)
                                ? field.value.filter(
                                    (id: number) => id !== dep.id,
                                  )
                                : [...field.value, dep.id];
                              field.onChange(newValue);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(dep.id)
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {dep.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SECCIÓN DE TELÉFONO INTELIGENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAMPO: CÓDIGO DE PAÍS + TELÉFONO */}
          <div className="space-y-2">
            <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Teléfono de Contacto (WhatsApp)
            </FormLabel>
            <div className="flex gap-2">
              {/* Selector de Código de País */}
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
                          {/* Buscador de Shadcn */}
                          <CommandInput
                            placeholder="Escribe el nombre del país..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>País no encontrado.</CommandEmpty>
                            <CommandGroup>
                              {countryList.map((country) => (
                                <CommandItem
                                  key={country.iso}
                                  // Combinamos nombre y código para que busque por ambos, y quitamos tildes
                                  value={`${country.name} ${country.code} ${country.iso}`
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase()}
                                  onSelect={() => {
                                    form.setValue("countryIso", country.iso);
                                    form.setValue("countryCode", country.code);
                                    form.setValue(
                                      "country",
                                      country.name || "",
                                    );
                                    form.trigger("phone"); // Valida al instante
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {/* Puedes añadir un span con el nombre real aquí para la vista */}
                                    <span className="text-[11px] font-bold uppercase">
                                      {country.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-black text-secondary-text">
                                    +{country.code}
                                  </span>
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

              {/* Input de Número Local */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {/* El FormLabel ya lo tienes arriba, aquí solo el control */}
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="987 654 321"
                        className={cn(
                          "h-11 border-gray-200 font-bold",
                          form.formState.errors.phone &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                    </FormControl>
                    {/* CRÍTICO: Este componente es el que muestra el texto rojo de Zod */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
          </div>

          {/* CAMPO: PAÍS DE RESIDENCIA (Sugerido pero editable) */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  País de Residencia / Origen
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: Perú"
                    className="h-11 border-gray-200 bg-white"
                  />
                </FormControl>
                <FormDescription className="text-[9px] uppercase font-bold text-slate-400">
                  Se autocompleta con el teléfono, pero puedes editarlo
                  manualmente.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 pb-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  CONTRASEÑA
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="h-11 pr-10 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generatePassword}
                    className="h-11 w-11 border-gray-200"
                  >
                    <RefreshCcw size={18} />
                  </Button>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  ROL
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      Administrador
                    </SelectItem>
                    <SelectItem value={UserRole.USER}>Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Acciones: Se mantienen fijas o al final del scroll según el contenedor */}
        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onSuccess}
            className="text-gray-500 font-semibold h-12 px-6"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isCreating}
            className="bg-secondary hover:bg-secondary-dark text-primary px-8 h-12 rounded-lg font-bold tracking-wide transition-all shadow-lg active:scale-95"
          >
            {isCreating ? "REGISTRANDO..." : "REGISTRAR PERSONAL"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
