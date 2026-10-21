"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  FileText,
  Calendar as CalendarIcon,
  Building2,
  Receipt,
  CreditCard,
} from "lucide-react";
import { DocumentStatus, PurchaseOrder } from "@/interfaces";
import { ActionsCellOrder } from "./ActionCellOrder";

const BILLING_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; barColor: string }
> = {
  PENDIENTE_FACTURACION: {
    label: "Pendiente",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    barColor: "bg-orange-400",
  },
  FACTURADO_PARCIAL: {
    label: "Parcial",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    barColor: "bg-blue-500",
  },
  FACTURADO_COMPLETO: {
    label: "Completo",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    barColor: "bg-emerald-500",
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
        <span
          className={`font-black uppercase tracking-tighter ${row.original.status === DocumentStatus.ANULADA ? "text-slate-400 line-through" : "text-primary"}`}
        >
          {row.original.poNumber}
        </span>
        {row.original.status === DocumentStatus.ANULADA && (
          <Badge
            variant="outline"
            title={row.original.annulReason ?? undefined}
            className="px-1.5 py-0 text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border-slate-300"
          >
            Anulada
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quoteNumber",
    header: "Cotización",
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
          <span
            className="font-bold text-slate-700 uppercase text-[11px] truncate max-w-[180px]"
            title={row.original.clientName}
          >
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
    header: "Recepción",
    cell: ({ row }) => {
      const date = new Date(`${row.original.receivedAt}T00:00:00`);
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
  // --- NUEVA COLUMNA: TOTAL DE LA ORDEN ---
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Monto Total</div>,
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
  // --- COLUMNA MEJORADA: PROGRESO DE FACTURACIÓN ---
  {
    accessorKey: "billingStatus",
    header: "Facturación",
    cell: ({ row }) => {
      const {
        billingStatus,
        billingPercentage = 0,
        remainingAmount = 0,
        currency,
        status: documentStatus,
        annulReason,
      } = row.original;

      // Una OC anulada no se factura: en lugar del avance se muestra el motivo
      if (documentStatus === DocumentStatus.ANULADA) {
        return (
          <div className="flex flex-col gap-1 min-w-[140px]">
            <Badge
              variant="outline"
              className="w-max px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border-slate-300"
            >
              Anulada
            </Badge>
            {annulReason && (
              <span
                className="text-[9px] font-medium text-slate-400 truncate max-w-[180px]"
                title={annulReason}
              >
                {annulReason}
              </span>
            )}
          </div>
        );
      }

      const status = billingStatus || "PENDIENTE_FACTURACION";
      const config = BILLING_STATUS_CONFIG[status] || {
        label: status,
        color: "bg-slate-50 text-slate-400 border-slate-200",
        barColor: "bg-slate-300",
      };

      return (
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 w-max px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${config.color}`}
            >
              <Receipt size={10} strokeWidth={3} />
              {config.label}
            </Badge>
            <span className="text-[10px] font-black text-slate-400">
              {billingPercentage}%
            </span>
          </div>

          {/* Barra de Progreso Dinámica */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${config.barColor}`}
              style={{ width: `${billingPercentage}%` }}
            />
          </div>

          {/* Saldo Pendiente Condicional */}
          {remainingAmount > 0 ? (
            <span className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">
              Falta:{" "}
              {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: currency || "USD",
              }).format(Number(remainingAmount))}
            </span>
          ) : (
            <span className="text-[8px] font-bold text-emerald-500 tracking-widest uppercase">
              Completado
            </span>
          )}
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
