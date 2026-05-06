"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  FileText,
  Calendar as CalendarIcon,
  Building2,
} from "lucide-react";
import { PurchaseOrder } from "@/interfaces";
import { ActionsCellOrder } from "./ActionCellOrder";

export const purchaseOrderColumns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: "Nº Orden Compra",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
          <ShoppingCart size={14} className="text-emerald-600" />
        </div>
        <span className="font-black text-primary uppercase tracking-tighter">
          {row.original.poNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "quoteNumber",
    header: "Cotización Vinculada",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText size={12} className="text-slate-400" />
        <Badge
          variant="outline"
          className="text-[10px] font-bold border-slate-200 bg-slate-50/50"
        >
          {row.original.quoteNumber}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <Building2 size={12} className="text-slate-400" />
          <span className="font-bold text-slate-700 uppercase text-[11px]">
            {row.original.clientName}
          </span>
        </div>
        {row.original.ruc && (
          <span className="text-[9px] text-slate-400 font-bold tracking-widest pl-4">
            RUC: {row.original.ruc}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "receivedAt",
    header: "Fecha Recepción",
    cell: ({ row }) => {
      const date = new Date(row.original.receivedAt);
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
    cell: ({ row }) => <ActionsCellOrder po={row.original} />,
  },
];
