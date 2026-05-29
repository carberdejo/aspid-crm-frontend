"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Receipt,
  ShoppingCart,
  FileText,
  Calendar as CalendarIcon,
  Building2,
  CreditCard,
} from "lucide-react";
import { Invoice } from "@/interfaces";
import { ActionsCellInvoice } from "./ActionsCellInvoice";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Nº Factura",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* Identificador rosado único para el módulo de facturación */}
        <div className="p-1.5 bg-rose-50 rounded-lg border border-rose-100">
          <Receipt size={14} className="text-rose-600" />
        </div>
        <span className="font-black text-slate-800 uppercase tracking-tighter">
          {row.original.invoiceNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "poNumber",
    header: "Orden de Compra",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ShoppingCart size={12} className="text-slate-400" />
        <Badge
          variant="outline"
          className="text-[10px] font-bold border-slate-200 bg-slate-50/50"
        >
          {row.original.poNumber || "Sin OC"}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "quoteNumber",
    header: "Cotización",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText size={12} className="text-slate-400" />
        <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          {row.original.quoteNumber || "---"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "businessName",
    header: "Cliente / Razón Social",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <Building2 size={12} className="text-slate-400" />
          <span
            className="font-bold text-slate-700 uppercase text-[11px] truncate max-w-[200px]"
            title={row.original.businessName}
          >
            {row.original.businessName}
          </span>
        </div>
        {row.original.ruc && (
          <span className="text-[9px] text-slate-400 font-bold tracking-widest pl-4 mt-0.5">
            RUC: {row.original.ruc}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "issueDate",
    header: "Fecha Emisión",
    cell: ({ row }) => {
      // Forzamos la zona horaria local al parsear la fecha que viene del backend
      const date = new Date(`${row.original.issueDate}T00:00:00`);
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
    header: () => <div className="text-right">Monto Facturado</div>,
    cell: ({ row }) => {
      const { amount, currency } = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5">
          <CreditCard size={12} className="text-slate-300" />
          <span className="text-xs font-black text-slate-800 font-mono tracking-tighter">
            {new Intl.NumberFormat("es-PE", {
              style: "currency",
              currency: currency || "USD",
              minimumFractionDigits: 2,
            }).format(Number(amount))}
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
    cell: ({ row }) => (
      /* Pasamos la factura completa para las acciones clásicas (Ver pdf, anular, etc) */
      <ActionsCellInvoice invoice={row.original} />
    ),
  },
];
