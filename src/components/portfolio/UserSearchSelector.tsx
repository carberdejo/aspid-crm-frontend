"use client";

import { useState, useMemo } from "react";
import { useUsers } from "@/hooks";
import { Combobox } from "@/components/ui/combobox";
import { User } from "@/interfaces";

interface UserSearchSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function UserSearchSelector({
  value,
  onChange,
}: UserSearchSelectorProps) {
  // Cada selector maneja su propia búsqueda de forma aislada
  const [search, setSearch] = useState("");

  // Cada selector dispara su propia query a TanStack Query
  const { users } = useUsers({
    isActive: true,
    term: search,
  });

  // Mapeamos las opciones localmente para este componente
  const options = useMemo(() => {
    if (!users) return [];
    return users.map((u: User) => ({
      value: u.id.toString(),
      label: `${u.firstName.toUpperCase()} ${u.lastName.toUpperCase()}`,
    }));
  }, [users]);

  return (
    <Combobox
      options={options}
      value={value ? value.toString() : ""}
      onChange={(val) => onChange(val ? Number(val) : 0)}
      onSearchChange={setSearch}
      shouldFilter={false} // El backend de NestJS filtra por nosotros
      placeholder="Buscar Usuario..."
    />
  );
}
