"use client";

import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDepartmentStore } from "@/store"; // Inyectamos tu store

interface DataTableToolbarProps {
  searchValue: string;
  onSearch: (val: string) => void;
  deptValue?: number;
  onDeptChange: (val: number | undefined) => void;
  activeValue?: boolean;
  onActiveChange: (val: boolean | undefined) => void;
  onReset: () => void;
  hasFilters: boolean;
}

export function DataTableToolbar({
  searchValue,
  onSearch,
  deptValue,
  onDeptChange,
  activeValue,
  onActiveChange,
  onReset,
  hasFilters,
}: DataTableToolbarProps) {
  const { departments } = useDepartmentStore();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4 bg-white">
      <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
        {/* Buscador Global (Nombre/CodUser) */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 h-10 border-gray-200 rounded-xl"
          />
        </div>

        {/* Filtro Departamento (Desde Store) */}
        <select
          value={deptValue || ""}
          onChange={(e) =>
            onDeptChange(e.target.value ? Number(e.target.value) : undefined)
          }
          className="h-10 px-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none min-w-[180px]"
        >
          <option value="">Todos los departamentos</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Filtro Estado (Active) */}
        <select
          value={activeValue === undefined ? "" : String(activeValue)}
          onChange={(e) => {
            const val = e.target.value;
            onActiveChange(val === "" ? undefined : val === "true");
          }}
          className="h-10 px-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary outline-none w-40"
        >
          <option value="">Cualquier estado</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 text-muted-foreground hover:text-primary font-bold uppercase text-[10px] tracking-widest"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
