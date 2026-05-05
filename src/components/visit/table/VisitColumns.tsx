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
  Eye,
} from "lucide-react";
import Link from "next/link";

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
        className="h-8 w-8 p-0"
        onClick={() => row.toggleExpanded()}
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="h-4 w-4 text-secondary" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
  },
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => {
      // Añadimos T00:00:00 para forzar a que se trate como fecha local y no UTC
      const dateValue = row.original.date;
      const date = new Date(`${dateValue}T00:00:00`);

      const formattedDate = dateFormatter.format(date);
      return (
        <div className="flex items-center gap-2 font-medium">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          <span className="capitalize">{formattedDate.replace(".", "")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-primary text-xs uppercase">
          {row.original.client.commercialName}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          RUC: {row.original.client.ruc}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contacto",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-700">
          {row.original.contact.firstName} {row.original.contact.lastName}
        </span>
        <span className="text-[10px] text-secondary font-medium uppercase tracking-tighter">
          {row.original.contact.position}
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
        className="gap-1.5 py-1 border-slate-200 text-slate-600 bg-slate-50/50"
      >
        <User className="h-3 w-3" />
        {row.original.user.firstName} {row.original.user.lastName}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
      const visit = row.original;
      return (
        <div className="flex justify-center">
          <Link href={`/department/${visit.departmentId}/visit/${visit.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 border-slate-200 hover:border-primary hover:bg-primary hover:text-white transition-all rounded-xl group flex gap-2"
            >
              <Eye
                size={14}
                className="group-hover:text-secondary transition-colors"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Detalle
              </span>
            </Button>
          </Link>
        </div>
      );
    },
  },
];
