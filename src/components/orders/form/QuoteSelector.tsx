"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Quote } from "@/interfaces";

interface QuoteSelectorProps {
  options: Quote[];
  onSearch: (term: string) => void;
  onSelect: (quote: Quote) => void;
  selectedId?: number;
}

export function QuoteSelector({
  options,
  onSearch,
  onSelect,
  selectedId,
}: QuoteSelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 justify-between rounded-xl border-slate-200 bg-white px-4 font-bold text-[14px] uppercase tracking-tight text-slate-700 shadow-sm hover:bg-slate-50"
        >
          {selectedId
            ? options.find((q) => q.id === selectedId)?.quoteNumber ||
              "Cotización seleccionada"
            : "Buscar cotización pendiente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-slate-100 overflow-hidden"
        align="start"
      >
        <Command shouldFilter={false}>
          {/* <div className="flex items-center border-b border-slate-100 px-3"> */}
          {/* <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-emerald-600" /> */}
          <CommandInput
            placeholder="Escribe el número o cliente..."
            onValueChange={onSearch}
            className="h-12 border-none focus:ring-0 text-[11px] uppercase font-bold"
          />
          {/* </div> */}
          <CommandList className="max-h-[250px] overflow-y-auto border-t border-slate-50 ">
            <CommandEmpty className="py-6 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
              No se encontraron cotizaciones.
            </CommandEmpty>
            <CommandGroup>
              {options.map((quote) => (
                <CommandItem
                  key={quote.id}
                  value={String(quote.id)}
                  onSelect={() => {
                    onSelect(quote);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start gap-1 py-3 px-4 aria-selected:bg-emerald-50 aria-selected:text-emerald-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-black text-[11px] uppercase text-primary">
                      {quote.quoteNumber}
                    </span>
                    {selectedId === quote.id && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[280px]">
                      {quote.client.commercialName} - {quote.client.ruc}
                    </span>
                    <span className="text-[9px] font-black text-emerald-600/70 uppercase tracking-widest">
                      Monto: {quote.currency} {quote.amount}
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
