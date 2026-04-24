'use client';

import { Input } from '@/components/ui/input';
import { Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientToolbarProps {
  onSearch: (val: string) => void;
  onRucSearch: (val: string) => void;
  searchValue: string;
  rucValue: string;
  onReset: () => void;
  onOpenCreate: () => void;
  hasFilters: boolean;
}

export function ClientToolbar({ 
  onSearch, 
  onRucSearch,
  searchValue, 
  rucValue,
  onReset,
  hasFilters
}: ClientToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 bg-white px-2">
      <div className="flex flex-1 items-center gap-2 w-full sm:max-w-xl">
        {/* Filtro por Nombre */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nombre comercial..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-10 border-gray-200"
          />
        </div>
        
        {/* Filtro por RUC */}
        <div className="relative w-40 hidden lg:block">
          <Input
            placeholder="RUC..."
            value={rucValue}
            onChange={(e) => onRucSearch(e.target.value)}
            className="h-10 border-gray-200"
          />
        </div>

        {hasFilters && (
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="h-10 px-3 text-muted-foreground hover:text-primary"
          >
            <FilterX size={18} />
          </Button>
        )}
      </div>
      
      
    </div>
  );
}