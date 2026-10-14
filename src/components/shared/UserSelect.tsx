"use client";

import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DepartmentMember } from "@/interfaces";

// Radix Select no admite "" como valor de un ítem: se usa un centinela para "ninguno"
const NONE = "none";

interface Props {
  members: DepartmentMember[];
  value?: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Usuario que no se ofrece (p. ej. el responsable al elegir colaborador) */
  excludeId?: string;
  /** Texto de la opción para dejar el campo vacío. Sin él, no se ofrece */
  noneLabel?: string;
}

/** Selector de un usuario del área (responsable o colaborador) */
export function UserSelect({
  members,
  value,
  onChange,
  isLoading,
  disabled,
  placeholder = "Seleccione un usuario",
  excludeId,
  noneLabel,
}: Props) {
  const options = members.filter((m) => String(m.id) !== excludeId);

  return (
    <Select
      value={value || (noneLabel ? NONE : "")}
      onValueChange={(v) => onChange(v === NONE ? "" : v)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50/50 font-bold text-primary px-4">
        {isLoading ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Cargando...
          </span>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
        {noneLabel && (
          <SelectItem
            value={NONE}
            className="text-[11px] italic text-slate-400 py-3 cursor-pointer"
          >
            {noneLabel}
          </SelectItem>
        )}
        {options.map((member) => (
          <SelectItem
            key={member.id}
            value={String(member.id)}
            className="py-3 cursor-pointer"
          >
            <span className="font-bold text-[11px] uppercase">
              {member.fullName}
            </span>
            <span className="ml-2 text-[9px] text-slate-400 font-mono">
              {member.codUser}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
