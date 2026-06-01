"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VisitListItem } from "@/interfaces/visit.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  User,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
} from "lucide-react";
import { ActionsCellVisit } from "./ActionsCellVisit"; // Componente extraído para mantener consistencia

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const visitColumns: ColumnDef<VisitListItem>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-sky-50 rounded-md transition-colors"
        onClick={() => row.toggleExpanded()}
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4 text-sky-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "client",
    header: "Cliente / Empresa",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* Identificador Celeste para Visitas/Terreno */}
        <div className="p-1.5 bg-sky-50 rounded-lg border border-sky-100 shrink-0">
          <MapPin size={14} className="text-sky-600" />
        </div>
        <div className="flex flex-col">
          <span
            className="font-bold text-slate-700 uppercase text-[11px] truncate max-w-[180px]"
            title={row.original.client.commercialName}
          >
            {row.original.client.commercialName}
          </span>
          <span className="text-[9px] text-slate-400 font-bold tracking-widest mt-0.5">
            RUC: {row.original.client.ruc}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Fecha de Visita",
    cell: ({ row }) => {
      const dateValue = row.original.date;
      const date = new Date(`${dateValue}T00:00:00`);
      const formattedDate = dateFormatter.format(date);

      return (
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarIcon size={12} className="opacity-40 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            {formattedDate.replace(".", "")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contacto",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-slate-400 shrink-0" />
          <span
            className="font-bold text-slate-600 uppercase text-[11px] truncate max-w-[150px]"
            title={`${row.original.contact.firstName} ${row.original.contact.lastName}`}
          >
            {row.original.contact.firstName} {row.original.contact.lastName}
          </span>
        </div>
        <span className="text-[9px] text-sky-500 font-bold tracking-widest uppercase pl-4 mt-0.5">
          {row.original.contact.position || "S/N CARGO"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "Registrado por",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-1.5 w-max px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] bg-slate-50 text-slate-500 border-slate-200"
      >
        <Briefcase size={10} strokeWidth={2.5} className="text-slate-400" />
        {row.original.user.firstName} {row.original.user.lastName}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Acciones
      </div>
    ),
    cell: ({ row }) => <ActionsCellVisit visit={row.original} />,
  },
];
