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
import { useVisitFlowStore } from "@/store/useVisitFlowStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClientChange?: (clientId: string) => void;
  disabled?: boolean;
}

export function ClientSearchSelector({
  value,
  onChange,
  onClientChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const newClientId = useVisitFlowStore((state) => state.newClientId);
  const clearNewClientId = useVisitFlowStore((state) => state.clearNewClientId);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { clients, isLoading } = useClients({
    term: debouncedSearch,
    limit: 10,
  });

  useEffect(() => {
    if (newClientId && clients.length > 0) {
      const newClient = clients.find(
        (c) => String(c.id) === String(newClientId),
      );
      if (newClient) {
        onChange(newClientId);
        onClientChange?.(newClientId);
        clearNewClientId();
      } else {
        // ✅ MEJORADO: Log para debugging si no se encuentra
        console.warn(
          `⚠️ [ClientSearchSelector] Cliente ${newClientId} no encontrado en búsqueda actual`,
          { searchedIn: clients.length, term: debouncedSearch }
        );
      }
    }
  }, [newClientId, clients, onChange, onClientChange, clearNewClientId, debouncedSearch]);

  const selectedClient = clients.find((c) => String(c.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Usamos un Button que PARECE un input. Esto elimina los conflictos de foco. */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full h-14 justify-between rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-slate-100 font-medium"
        >
          <span className="truncate">
            {selectedClient
              ? selectedClient.commercialName
              : "Buscar cliente..."}
          </span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl">
        {/* Desactivamos shouldFilter porque filtramos en el servidor con debouncedSearch */}
        <Command shouldFilter={false}>
          {/* Este es el Input real de búsqueda que vive DENTRO del popover */}
          <CommandInput
            placeholder="Escribe el nombre del cliente..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-12"
          />
          <CommandList className="max-h-[300px]">
            {!isLoading && clients.length === 0 && (
              <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            )}
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={String(client.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    onClientChange?.(currentValue);
                    setSearchTerm(""); // Reseteamos la búsqueda al seleccionar
                    setOpen(false);
                  }}
                  className="cursor-pointer py-3"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === String(client.id) ? "opacity-100 text-secondary" : "opacity-0"}`}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-xs uppercase">
                      {client.commercialName}
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
