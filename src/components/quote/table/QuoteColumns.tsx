"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quote } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Formateador de moneda para Soles
const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export const quoteColumns: ColumnDef<Quote>[] = [
  {
    accessorKey: "quoteNumber",
    header: "Nº Cotización",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-secondary" />
        <span className="font-black text-primary uppercase">
          {row.original.quoteNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "client.commercialName",
    header: "Cliente / Empresa",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-700 uppercase text-[11px] leading-tight">
          {row.original.client.commercialName}
        </span>
        <span className="text-[9px] text-slate-400 font-medium">
          RUC: {row.original.client.ruc}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Monto Total",
    cell: ({ row }) => (
      <span className="font-black text-primary text-sm">
        {currencyFormatter.format(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="text-[9px] font-black uppercase border-slate-200 text-slate-500"
      >
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      // Lógica de colores según estado
      const statusStyles: Record<string, string> = {
        PENDING: "bg-orange-100 text-orange-600 border-orange-200",
        APPROVED: "bg-green-100 text-green-600 border-green-200",
        REJECTED: "bg-red-100 text-red-600 border-red-200",
      };

      return (
        <Badge
          className={`text-[9px] font-black uppercase border ${statusStyles[status] || "bg-slate-100 text-slate-600"}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex flex-col text-[10px] font-bold text-slate-500 uppercase">
          <span>{date.toLocaleDateString("es-PE")}</span>
          <span className="text-[8px] opacity-60">
            {date.toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xl border-slate-200 shadow-xl"
        >
          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Opciones
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 font-bold text-xs text-primary cursor-pointer uppercase">
            <Eye size={14} /> Ver Detalle
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 font-bold text-xs text-secondary cursor-pointer uppercase">
            <FileText size={14} /> Descargar PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
