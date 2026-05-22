// src/components/ui/combobox.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onSearchChange?: (value: string) => void;
  shouldFilter?: boolean;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  maxLength?: number; // Añadimos una prop opcional por si quieres cambiarlo luego
}

export function Combobox({
  options = [],
  value,
  onChange,
  onSearchChange,
  shouldFilter = true,
  placeholder = "Seleccionar opción...",
  emptyText = "No se encontraron resultados.",
  disabled = false,
  maxLength = 32, // Límite de caracteres antes de cortar
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // 1. Buscamos el label seleccionado
  const selectedOption = options.find((option) => option.value === value);
  let displayLabel = selectedOption?.label || "";

  // 2. Aplicamos tu idea: cortamos el texto con JavaScript si es muy largo
  if (displayLabel.length > maxLength) {
    displayLabel = displayLabel.substring(0, maxLength) + "...";
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          // Añadimos max-w-full para evitar desbordamientos
          className="w-full justify-between h-11 font-normal max-w-full"
        >
          {value ? (
            <span title={selectedOption?.label}>{displayLabel}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder={`Buscar...`}
            onValueChange={onSearchChange}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                // También cortamos el texto en las opciones del menú desplegable por si acaso
                const itemLabel =
                  option.label.length > maxLength + 10
                    ? option.label.substring(0, maxLength + 10) + "..."
                    : option.label;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span title={option.label}>{itemLabel}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
