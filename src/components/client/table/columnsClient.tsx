"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ChevronRight,
  Building2,
  UserCircle,
  AlertTriangle,
  Factory,
  Briefcase,
  MapPin,
} from "lucide-react";
import { ClientListItem } from "@/interfaces/client.interface";

import { cn } from "@/lib";
import Link from "next/link";
import { ActionCellClient } from "./ActionCellClient";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<ClientListItem>[] = [
  // 1. CARTERA (Mejorada)
  {
    id: "portfolio",
    header: "Cartera",
    cell: ({ row }) => {
      const portfolio = row.original.portfolio;
      if (!portfolio)
        return <span className="text-sm text-slate-300 font-medium">-</span>;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
          >
            <Briefcase size={14} className="mr-1.5" />
            {portfolio.code}
          </Badge>
          {!portfolio.isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle size={16} className="text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Esta cartera de ingeniería está inactiva.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  // 2. SEGMENTO (Mejorada)
  {
    id: "segment",
    header: "Segmentación",
    cell: ({ row }) => {
      const segment = row.original.segment;
      if (!segment)
        return <span className="text-sm text-slate-300 font-medium">-</span>;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
          >
            <Factory size={14} className="mr-1.5" />
            {segment.code}
          </Badge>
          {!segment.isActive && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle size={16} className="text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Este segmento industrial está inactivo.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
  // 3. CLIENTE
  {
    accessorKey: "businessName",
    header: "Razón Social",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
          <Building2 size={18} />
        </div>
        <div className="flex flex-col min-w-0">
          <Link
            href={`/client/${row.original.id}`}
            className="font-black text-primary text-[13px] leading-tight hover:text-secondary-text transition-colors uppercase tracking-tight"
          >
            {row.original.businessName}
          </Link>
          {row.original.commercialName && (
            <span className="text-[10.5px] text-muted-foreground italic tracking-wide mt-1 opacity-80 truncate max-w-[280px]">
              {row.original.commercialName}
            </span>
          )}
        </div>
      </div>
    ),
  },
  // 4. RUC
  {
    accessorKey: "ruc",
    header: "RUC",
    cell: ({ row }) => (
      <span className="font-mono text-[13px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
        {row.getValue("ruc")}
      </span>
    ),
  },
  // 5. UBICACIÓN
  {
    id: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      const { province, district } = row.original;
      if (!province && !district)
        return <span className="text-sm text-slate-300 font-medium">-</span>;

      return (
        <div className="flex flex-col min-w-0 max-w-[180px]">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 truncate uppercase">
            <MapPin size={14} className="text-slate-400" />
            {province || "N/A"}
          </span>
          <span className="text-[11px] text-slate-500 pl-5 truncate uppercase font-medium mt-0.5">
            {district || "Sin distrito"}
          </span>
        </div>
      );
    },
  },
  // 6. ZONA
  {
    accessorKey: "zone",
    header: "Zona",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-slate-600 uppercase">
        {row.getValue("zone") || "-"}
      </span>
    ),
  },
  // 7. CONTACTOS
  {
    accessorKey: "contacts",
    header: "Contactos",
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const count = row.original.contacts;

      return (
        <div
          onClick={() => meta?.openContactSheet(row.original)}
          className={cn(
            "inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer group/badge",
            count > 0
              ? "bg-slate-50 border-slate-200 hover:border-secondary/40 hover:bg-secondary/5 shadow-sm"
              : "bg-slate-50/50 border-transparent opacity-50 grayscale",
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center transition-colors",
              count > 0
                ? "bg-secondary text-primary shadow-sm"
                : "bg-slate-200 text-slate-400",
            )}
          >
            <UserCircle size={13} />
          </div>
          <span
            className={cn(
              "text-xs font-black tracking-tighter",
              count > 0
                ? "text-slate-700 group-hover/badge:text-secondary-text"
                : "text-slate-400",
            )}
          >
            {count}
          </span>
          {count > 0 && (
            <ChevronRight
              size={12}
              className="text-slate-300 group-hover/badge:text-secondary-text group-hover/badge:translate-x-0.5 transition-all"
            />
          )}
        </div>
      );
    },
  },
  // 8. ACCIONES
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionCellClient client={row.original} />,
  },
];
