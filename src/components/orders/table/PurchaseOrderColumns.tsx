"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  FileText,
  Calendar as CalendarIcon,
  Building2,
  Receipt, // Añadimos este icono para facturación
} from "lucide-react";
import { PurchaseOrder } from "@/interfaces";
import { ActionsCellOrder } from "./ActionCellOrder";

// Definimos los colores y etiquetas legibles para cada estado
const BILLING_STATUS_CONFIG: Record<string, { label: string; color: string }> =
  {
    PENDIENTE_FACTURACION: {
      label: "Pendiente",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    FACTURADO_PARCIAL: {
      label: "Parcial",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    FACTURADO_COMPLETO: {
      label: "Completo",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  };

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
      const date = new Date(`${row.original.receivedAt}T00:00:00`);
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
  // --- NUEVA COLUMNA DE ESTADO DE FACTURACIÓN ---
  {
    accessorKey: "billingStatus", // Asegúrate de que el key coincida con tu interfaz (puede ser billingStatus)
    header: "Estado Facturación",
    cell: ({ row }) => {
      const status = row.original.billingStatus; // Ajustar a camelCase si tu interfaz usa billingStatus

      const config = BILLING_STATUS_CONFIG[status as string] || {
        label: status || "Desconocido",
        color: "bg-slate-50 text-slate-400 border-slate-200",
      };

      return (
        <Badge
          variant="outline"
          className={`flex items-center gap-1.5 w-max px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${config.color}`}
        >
          <Receipt size={10} strokeWidth={3} />
          {config.label}
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
    cell: ({ row }) => <ActionsCellOrder po={row.original} />,
  },
];
