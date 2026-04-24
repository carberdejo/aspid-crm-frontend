'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps {
  onSearch?: (value: string) => void;
  onRoleFilter?: (role: string) => void;
  onResetFilters?: () => void;
  searchValue?: string;
  roleValue?: string;
  hasFilters?: boolean;
}

const roleOptions = [
  { value: '', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'PROYECTOS', label: 'Proyectos' },
  { value: 'SOPORTE', label: 'Soporte' },
];

export function DataTableToolbar({
  onSearch,
  onRoleFilter,
  onResetFilters,
  searchValue = '',
  roleValue = '',
  hasFilters = false,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        {/* Búsqueda */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>

        {/* Select de Role */}
        <select
          value={roleValue}
          onChange={(e) => onRoleFilter?.(e.target.value)}
          className="h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1a2a53] focus:border-transparent w-full sm:w-48"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Botón Reset */}
        {hasFilters && (
          <button
            onClick={onResetFilters}
            className="h-10 px-4 py-2 text-sm flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
          >
            Resetear
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info de resultados (opcional) */}
      {hasFilters && (
        <div className="text-sm text-gray-600">
          Filtros activos
        </div>
      )}
    </div>
  );
}
