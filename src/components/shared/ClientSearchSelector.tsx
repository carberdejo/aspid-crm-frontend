"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClients } from "@/hooks";
// ¡Adiós useVisitFlowStore! Ya no lo necesitamos aquí.

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClientChange?: (clientId: string) => void;
  disabled?: boolean;
  /**
   * Solo admin: muestra los clientes que puede usar ese usuario (el responsable elegido).
   * Para un empleado el backend lo ignora y aplica su propio alcance
   */
  userId?: number;
  /**
   * Nombre del cliente ya guardado (al editar). Se muestra mientras ese cliente no
   * aparezca en la primera página de resultados de la búsqueda
   */
  selectedLabel?: string;
}

export function ClientSearchSelector({
  value,
  onChange,
  onClientChange,
  disabled,
  userId,
  selectedLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Caché local para el cliente seleccionado
  const [selectedClientData, setSelectedClientData] = useState<{
    id: string;
    commercialName: string;
  } | null>(null);

  // 1. Debounce para no saturar el backend al escribir
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { clients, isLoading } = useClients({
    term: debouncedSearch,
    limit: 10,
    userId,
  });

  // 2. Efecto para sincronizar la UI cuando el 'value' cambia desde react-hook-form
  useEffect(() => {
    if (value) {
      const foundClient = clients.find((c) => String(c.id) === value);
      if (foundClient) {
        // Actualización funcional para evitar renders en cascada (Bailout)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedClientData((prev) => {
          if (prev?.id === String(foundClient.id)) return prev;
          return {
            id: String(foundClient.id),
            commercialName: foundClient.commercialName,
          };
        });
      }
    } else {
      setSelectedClientData((prev) => (prev === null ? prev : null));
    }
  }, [value, clients]);

  const formatDisplayValue = (text: string, limit: number = 35) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full h-14 justify-between rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-slate-100 font-medium px-4"
        >
          <span className="text-left flex-1 block">
            {selectedClientData
              ? formatDisplayValue(selectedClientData.commercialName)
              : value && selectedLabel
                ? formatDisplayValue(selectedLabel)
                : "Buscar cliente..."}
          </span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[350px] md:w-[450px] p-0 rounded-2xl shadow-2xl border-slate-100 bg-white"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Escribe el nombre del cliente..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-12 border-none focus:ring-0 text-[11px] font-bold uppercase"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            {!isLoading && clients.length === 0 && (
              <CommandEmpty className="py-6 text-center text-[10px] font-black uppercase text-slate-400">
                No se encontraron clientes.
              </CommandEmpty>
            )}
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={String(client.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    onClientChange?.(currentValue);

                    // Guardamos la info del cliente seleccionado para la UI
                    setSelectedClientData({
                      id: String(client.id),
                      commercialName: client.commercialName,
                    });

                    setSearchTerm("");
                    setOpen(false);
                  }}
                  className="cursor-pointer py-3"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === String(client.id) ? "opacity-100 text-secondary" : "opacity-0"}`}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-xs uppercase">
                      {formatDisplayValue(client.commercialName, 45)}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      RUC: {client.ruc}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
