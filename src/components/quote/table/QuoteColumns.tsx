"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quote, QuoteStatus } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar as CalendarIcon, User } from "lucide-react"; // Importamos User
import { ActionsCell } from "./ActionsCell";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

export const quoteColumns: ColumnDef<Quote>[] = [
  {
    accessorKey: "quoteNumber",
    header: "Nº Cotización",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100">
          <FileText size={14} className="text-secondary" />
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
        <span className="font-bold text-slate-700 uppercase text-[11px] leading-tight">
          {row.original.client.commercialName}
        </span>
        <span className="text-[9px] text-slate-400 font-bold tracking-widest opacity-70">
          RUC: {row.original.client.ruc}
        </span>
      </div>
    ),
  },
  // --- NUEVA COLUMNA DE CONTACTO ---
  {
    accessorKey: "contact",
    header: "Contacto",
    cell: ({ row }) => {
      const contact = row.original.contact;
      if (!contact)
        return <span className="text-slate-300 text-[10px] italic">-</span>;

      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <User size={10} className="text-slate-400" />
            <span className="font-bold text-slate-600 uppercase text-[10px]">
              {contact.firstName} {contact.lastName}
            </span>
          </div>
          <span className="text-[9px] text-secondary font-black tracking-tighter uppercase opacity-80 pl-4">
            {contact.position || "S/N CARGO"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-center">Monto Total</div>,
    cell: ({ row }) => {
      const { amount, currency } = row.original;
      return (
        <div className="flex justify-center">
          <span className="inline-flex justify-center items-center font-black text-primary text-[12px] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 min-w-[110px] shadow-sm tracking-tight">
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
          className={`text-[9px] font-black uppercase px-3 py-1 border shadow-sm ${statusStyles[status] || "bg-slate-50 text-slate-500"}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha Emisión",
    cell: ({ row }) => {
      // Usamos el mismo truco para evitar el desfase de fecha si createdAt viene como string de fecha pura
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex items-center gap-2 text-slate-500">
          <CalendarIcon size={12} className="opacity-40" />
          <span className="text-[11px] font-bold uppercase tracking-tight">
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
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Acciones
      </div>
    ),
    cell: ({ row }) => <ActionsCell quote={row.original} />,
  },
];
