"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quote, QuoteStatus } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar as CalendarIcon,
  User,
  Building2,
  CreditCard,
  CircleDot, // Icono extra para el estado
} from "lucide-react";
import { ActionsCell } from "./ActionsCell";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2, // Garantizamos siempre 2 decimales
  }).format(amount);
};

export const quoteColumns: ColumnDef<Quote>[] = [
  {
    accessorKey: "quoteNumber",
    header: "Nº Cotización",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* Identificador Naranja para Cotizaciones */}
        <div className="p-1.5 bg-orange-50 rounded-lg border border-orange-100">
          <FileText size={14} className="text-orange-600" />
        </div>
        <span className="font-black text-primary uppercase tracking-tighter">
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
        <div className="flex items-center gap-1.5">
          <Building2 size={12} className="text-slate-400" />
          <span
            className="font-bold text-slate-700 uppercase text-[11px] truncate max-w-[180px]"
            title={row.original.client.commercialName}
          >
            {row.original.client.commercialName}
          </span>
        </div>
        <span className="text-[9px] text-slate-400 font-bold tracking-widest pl-4 mt-0.5">
          RUC: {row.original.client.ruc}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contacto",
    cell: ({ row }) => {
      const contact = row.original.contact;
      if (!contact)
        return (
          <span className="text-slate-300 text-[10px] italic pl-4">
            - Sin asignar -
          </span>
        );

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-slate-400 shrink-0" />
            <span
              className="font-bold text-slate-600 uppercase text-[11px] truncate max-w-[150px]"
              title={`${contact.firstName} ${contact.lastName}`}
            >
              {contact.firstName} {contact.lastName}
            </span>
          </div>
          <span className="text-[9px] text-orange-500 font-bold tracking-widest uppercase pl-4 mt-0.5">
            {contact.position || "S/N CARGO"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha Emisión",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarIcon size={12} className="opacity-40" />
          <span className="text-[10px] font-bold uppercase tracking-tight">
            {date.toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Monto Total</div>,
    cell: ({ row }) => {
      const { amount, currency } = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5">
          <CreditCard size={12} className="text-slate-300" />
          <span className="text-xs font-black text-slate-800 font-mono tracking-tighter">
            {formatCurrency(amount, currency)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusStyles: Record<QuoteStatus, string> = {
        [QuoteStatus.PENDIENTE]: "bg-amber-50 text-amber-600 border-amber-200",
        [QuoteStatus.APROBADO]:
          "bg-emerald-50 text-emerald-600 border-emerald-200",
        [QuoteStatus.RECHAZADO]: "bg-rose-50 text-rose-600 border-rose-200",
      };

      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1.5 w-max px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${statusStyles[status] || "bg-slate-50 text-slate-500"}`}
        >
          <CircleDot size={10} strokeWidth={3} />
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Acciones
      </div>
    ),
    cell: ({ row }) => <ActionsCell quote={row.original} />,
  },
];
