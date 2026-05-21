"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/schemas/client";
import { Loader2, Search } from "lucide-react";

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
  useClients,
  useIndustrySegments,
  usePortfolios,
  useRuc,
} from "@/hooks";
import { toast } from "sonner";
import { ClienteCreateResponseItem, IndustrySegment } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { useState } from "react"; // Necesario para el estado de carga manual
import { Portfolio } from "@/interfaces/portfolio.interface";
import { Combobox } from "@/components/ui/combobox";
import React from "react";

interface ClientFormProps {
  onSuccess: (client?: ClienteCreateResponseItem) => void;
}

export function ClientForm({ onSuccess }: ClientFormProps) {
  const { createClient, isCreating } = useClients();
  const [segmentSearch, setSegmentSearch] = useState("");
  const [portfolioSearch, setPortfolioSearch] = useState("");
  // Consumimos los catálogos usando TanStack Query
  const { portfolios, isLoading: isLoadingPortfolios } = usePortfolios({
    limit: 1000,
    term: portfolioSearch,
  });
  const { industrySegments, isLoading: isLoadingSegments } =
    useIndustrySegments({
      limit: 1000,
      term: segmentSearch,
    });

  // Estado local para controlar el loader del botón de búsqueda
  const [isSearchingRuc, setIsSearchingRuc] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      commercialName: "",
      businessName: "",
      ruc: "",
      address: "",
      segmentId: undefined,
      portfolioId: undefined,
      district: "",
      zone: "",
      province: "",
    },
  });

  // Mapeamos los datos de la API al formato que espera el Combobox
  const segmentOptions = React.useMemo(() => {
    if (!industrySegments) return [];
    return industrySegments.map((segment: IndustrySegment) => ({
      value: segment.id.toString(),
      label: `${segment.code} - ${segment.name}`,
    }));
  }, [industrySegments]);

  const portfolioOptions = React.useMemo(() => {
    if (!portfolios) return [];
    return portfolios.map((portfolio: Portfolio) => ({
      value: portfolio.id.toString(),
      label: `${portfolio.code} - ${portfolio.zone || portfolio.type}`,
    }));
  }, [portfolios]);

  // OPTIMIZACIÓN 1: Ya no usamos watch("ruc") para no renderizar en cada pulsación.
  // En su lugar, consumimos el hook `useRuc` que expone una función `fetchByRuc(ruc)`
  // para ejecutar la búsqueda con el valor actual del input al hacer click.
  const { fetchByRuc } = useRuc();

  const onSearchRuc = async () => {
    // OPTIMIZACIÓN 2: Leemos el valor exacto en el momento del clic, sin vigilar el input.
    const currentRuc = form.getValues("ruc");

    if (!currentRuc || currentRuc.length !== 11) {
      toast.error("El RUC debe tener exactamente 11 dígitos");
      // UX: Hacemos focus en el campo si hay error
      form.setFocus("ruc");
      return;
    }

    try {
      setIsSearchingRuc(true);

      // Ejecutamos la búsqueda pasando el RUC actual
      const info = await fetchByRuc(currentRuc);
      console.log("Resultado de la búsqueda RUC:", info);
      if (info && info.razonSocial) {
        form.setValue("businessName", info.razonSocial, {
          shouldValidate: true,
        });
        form.setValue("address", info.direccion, { shouldValidate: true });
        form.setValue("commercialName", info.razonSocial, {
          shouldValidate: true,
        });

        // Manejamos posibles valores nulos de SUNAT con un fallback de string vacío
        form.setValue("district", info.distrito || "", {
          shouldValidate: true,
        });
        form.setValue("province", info.provincia || "", {
          shouldValidate: true,
        });

        toast.success("Información recuperada de SUNAT");

        // UX: Movemos el foco al siguiente campo vacío lógico (Nombre Comercial)
        form.setFocus("commercialName");
      } else {
        toast.error("RUC no hallado en los registros de SUNAT");
        clearSunatFields();
      }
    } catch (error) {
      const msg =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.message ||
        "Error al conectar con SUNAT. Intente de nuevo.";
      toast.error(msg);
      clearSunatFields();
    } finally {
      setIsSearchingRuc(false);
    }
  };

  const clearSunatFields = () => {
    form.setValue("businessName", "");
    form.setValue("address", "");
    form.setValue("district", "");
    form.setValue("province", "");
    // No limpiamos la zona porque no viene de SUNAT
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          createClient(v, {
            onSuccess: (response) => {
              onSuccess(response.item);
            },
          });
        })}
        className="space-y-6 pb-4"
      >
        {/* Bloque de Búsqueda de RUC */}
        <div className="bg-muted/30 p-5 rounded-xl border border-dashed border-gray-300">
          <FormField
            control={form.control}
            name="ruc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Paso 1: Validación RUC
                </FormLabel>
                <div className="flex gap-2 mt-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="20XXXXXXXXX"
                      maxLength={11}
                      // UX: Solo permitir números en el input type="text"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                      className="h-11 bg-white border-gray-200 font-mono text-lg"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={onSearchRuc}
                    disabled={isSearchingRuc || field.value.length !== 11} // UX: Deshabilita el botón si no hay 11 dígitos
                    className="bg-primary hover:bg-primary/90 text-white w-14 h-11 transition-all"
                  >
                    {isSearchingRuc ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Search size={20} />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Datos Autocompletados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                {" "}
                {/* UX: La Razón Social suele ser larga */}
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Razón Social
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Se llenará automáticamente..."
                    className="h-11 bg-gray-50 border-gray-200 font-medium text-gray-600"
                    readOnly
                    tabIndex={-1} // UX: Evita que el usuario haga tab aquí ya que es readonly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commercialName"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Nombre Comercial
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej. ACME SAC"
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Dirección Fiscal
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Dirección legal..."
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Provincia
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Provincia..."
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Distrito
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Distrito..."
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selector de Segmento Industrial */}
          <FormField
            control={form.control}
            name="segmentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-bold text-gray-700 uppercase mb-1">
                  Segmento Industrial
                </FormLabel>
                <Combobox
                  options={segmentOptions}
                  value={field.value?.toString() || ""}
                  onChange={(val) =>
                    field.onChange(val ? Number(val) : undefined)
                  }
                  // 3. Conectamos la búsqueda remota
                  onSearchChange={setSegmentSearch}
                  shouldFilter={false} // <- Clave: El backend filtra, no el frontend
                  placeholder={
                    isLoadingSegments ? "Cargando..." : "Seleccione un rubro"
                  }
                  disabled={isLoadingSegments}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selector de Cartera de Accesos */}
          <FormField
            control={form.control}
            name="portfolioId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-xs font-bold text-gray-700 uppercase mb-1">
                  Cartera Asignada
                </FormLabel>
                <Combobox
                  options={portfolioOptions}
                  value={field.value?.toString() || ""}
                  onChange={(val) =>
                    field.onChange(val ? Number(val) : undefined)
                  }
                  // 3. Conectamos la búsqueda remota
                  onSearchChange={setPortfolioSearch}
                  shouldFilter={false} // <- Clave: El backend filtra, no el frontend
                  placeholder={
                    isLoadingPortfolios
                      ? "Cargando..."
                      : "Seleccione una cartera"
                  }
                  disabled={isLoadingPortfolios}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zone"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                {" "}
                {/* UX: Ocupar todo el ancho si está solo abajo */}
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Zona / Sector (Opcional)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej. Zona Industrial..."
                    className="h-11 border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSuccess()}
            className="font-bold text-gray-500 h-12 px-6"
          >
            CANCELAR
          </Button>
          <Button
            type="submit"
            disabled={isCreating || isSearchingRuc}
            className="bg-secondary hover:bg-secondary/90 text-white px-10 h-12 rounded-lg font-black transition-all shadow-md active:scale-95"
          >
            {isCreating ? "PROCESANDO..." : "REGISTRAR EMPRESA"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
