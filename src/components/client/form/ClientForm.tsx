"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/schemas/client"; // Asegúrate de tener este schema
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
import { ClienteCreateResponseItem } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

interface ClientFormProps {
  // El "?" hace que el cliente sea opcional al llamar a la función
  onSuccess: (client?: ClienteCreateResponseItem) => void;
}

export function ClientForm({ onSuccess }: ClientFormProps) {
  const { createClient, isCreating } = useClients();

  // Consumimos los catálogos usando TanStack Query
  const { portfolios, isLoading: isLoadingPortfolios } = usePortfolios({});
  const { industrySegments, isLoading: isLoadingSegments } =
    useIndustrySegments({});

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as Resolver<ClientFormValues>,
    defaultValues: {
      commercialName: "",
      businessName: "",
      ruc: "",
      address: "",
      segmentId: undefined,
      portfolioId: undefined,
    },
  });

  // Extraemos el valor actual del RUC para la query
  const currentRuc = form.watch("ruc");
  // Hook de TanStack Query para el RUC
  const { refetch, isFetching } = useRuc(currentRuc);

  const onSearchRuc = async () => {
    if (currentRuc.length !== 11) {
      return toast.error("El RUC debe tener 11 dígitos");
    }

    const { data, isSuccess } = await refetch();

    if (isSuccess && data?.razonSocial) {
      const info = data; // Accedemos a la propiedad data del ResponseRuc

      form.setValue("businessName", info.razonSocial, { shouldValidate: true });
      form.setValue("address", info.direccion, { shouldValidate: true });
      form.setValue("commercialName", info.razonSocial, {
        shouldValidate: true,
      });

      toast.success("Información recuperada de SUNAT");
    } else {
      // 2. Si isSuccess es true pero no hay razonSocial, lo tratamos como "No encontrado"
      toast.error("RUC no hallado en los registros de SUNAT");

      // Opcional: Limpiar los campos si antes tenían algo de una búsqueda previa
      form.setValue("businessName", "");
      form.setValue("address", "");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => {
          // Llamamos a createClient (que es la mutación de TanStack Query)
          createClient(v, {
            onSuccess: (response) => {
              // 'response' es lo que devuelve tu backend: { message: string, data: ClientItem }
              // Pasamos solo la DATA al callback del modal
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
                      className="h-11 bg-white border-gray-200 font-mono text-lg"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={onSearchRuc}
                    disabled={isFetching}
                    className="bg-primary hover:bg-primary/90 text-white w-14 h-11"
                  >
                    {isFetching ? (
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
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Razón Social
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Se llenará automáticamente..."
                    className="h-11 bg-gray-50 border-gray-200 font-medium"
                    readOnly
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
              <FormItem>
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
              <FormItem>
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
          {/* Selector de Segmento Industrial */}
          <FormField
            control={form.control}
            name="segmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Segmento Industrial
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString() || ""}
                  disabled={isLoadingSegments}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          isLoadingSegments
                            ? "Cargando..."
                            : "Seleccione un rubro"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {industrySegments.map((segment) => (
                      <SelectItem
                        key={segment.id}
                        value={segment.id.toString()}
                      >
                        {segment.code} - {segment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selector de Cartera de Accesos */}
          <FormField
            control={form.control}
            name="portfolioId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-gray-700 uppercase">
                  Cartera Asignada
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString() || ""}
                  disabled={isLoadingPortfolios}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          isLoadingPortfolios
                            ? "Cargando..."
                            : "Seleccione una cartera"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {portfolios.map((portfolio) => (
                      <SelectItem
                        key={portfolio.id}
                        value={portfolio.id.toString()}
                      >
                        {portfolio.code} - {portfolio.zone || portfolio.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            disabled={isCreating || isFetching}
            className="bg-secondary hover:bg-secondary/90 text-white px-10 h-12 rounded-lg font-black transition-all shadow-md active:scale-95"
          >
            {isCreating ? "PROCESANDO..." : "REGISTRAR CLIENTE"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
