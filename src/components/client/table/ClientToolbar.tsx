"use client";

import { Input } from "@/components/ui/input";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export function ClientToolbar({
  searchValue,
  onSearch,
  onReset,
  hasFilters,
}: ClientToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 bg-white">
      <div className="flex flex-1 items-center gap-2 w-full sm:max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o RUC..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-10 border-gray-200 focus-visible:ring-primary rounded-xl"
          />
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 px-3 text-muted-foreground hover:text-primary transition-all"
          >
            <FilterX size={18} className="mr-2" />
            <span className="text-xs font-bold uppercase">Limpiar</span>
          </Button>
        )}
      </div>
    </div>
  );
}
