'use client';

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContactsByClient } from "@/hooks";
import { useVisitFlowStore } from "@/store/useVisitFlowStore";

interface Props {
  value: string;
  onChange: (value: string) => void;
  clientId: number;
  disabled?: boolean;
}

export function ContactSearchSelector({ value, onChange, clientId, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Filtro local

  const newContactId = useVisitFlowStore((state) => state.newContactId);
  const clearNewContactId = useVisitFlowStore((state) => state.clearNewContactId);

  const { contact } = useContactsByClient(clientId);
  const contacts = Array.isArray(contact?.data) ? contact.data : [];
  const isLoading = contact?.isLoading;

  useEffect(() => {
    if (newContactId && !isLoading && contacts.length > 0) {
      const newContact = contacts.find(c => String(c.id) === String(newContactId));
      if (newContact) {
        onChange(String(newContactId));
        clearNewContactId();
      } else {
        // ✅ MEJORADO: Log para debugging si no se encuentra
        console.warn(
          `⚠️ [ContactSearchSelector] Contacto ${newContactId} no en caché`,
          { clientId, totalContacts: contacts.length }
        );
      }
    } else if (newContactId && isLoading) {
      // ✅ MEJORADO: Log cuando aún está cargando
      console.log(
        `⏳ [ContactSearchSelector] Esperando contactos para cliente ${clientId}`
      );
    }
  }, [newContactId, contacts, isLoading, onChange, clearNewContactId]);

  // Filtramos localmente (shadcn Command lo hace por defecto con shouldFilter=true, 
  // pero lo hacemos manual para más control sobre los nombres compuestos)
  const filteredContacts = contacts.filter((c) => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedContact = contacts.find((c) => String(c.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || !clientId}
          className="w-full h-14 justify-between rounded-2xl border-slate-200 bg-slate-50/50 hover:bg-slate-100 font-medium"
        >
          <span className="truncate">
            {selectedContact 
              ? `${selectedContact.firstName} ${selectedContact.lastName}`
              : clientId 
                ? "Buscar contacto..." 
                : "Seleccione cliente primero"}
          </span>
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl">
        {/* Aquí la búsqueda se hace en el cliente, así que podemos confiar en el filtro manual o el de Command */}
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="h-12"
          />
          <CommandList className="max-h-[250px]">
            {filteredContacts.length === 0 && (
              <CommandEmpty>No se encontraron contactos.</CommandEmpty>
            )}
            <CommandGroup>
              {filteredContacts.map((c) => (
                <CommandItem
                  key={c.id}
                  value={String(c.id)}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setSearchTerm("");
                    setOpen(false);
                  }}
                  className="cursor-pointer py-3"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === String(c.id) ? "opacity-100 text-secondary" : "opacity-0"}`}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1a2a53] text-xs uppercase">{c.firstName} {c.lastName}</span>
                    <span className="text-[9px] text-slate-400">{c.position || "Sin cargo definido"}</span>
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