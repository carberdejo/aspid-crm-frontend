"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Building2, UserCircle } from "lucide-react";
import { ClientListItem } from "@/interfaces/client.interface";

import { cn } from "@/lib";
import Link from "next/link";
import { ActionCellClient } from "./ActionCellClient";

// type ClientTableMeta = {
//   openContactSheet?: (client: ClientListItem) => void;
// };

export const columns: ColumnDef<ClientListItem>[] = [
  {
    accessorKey: "commercialName",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
          <Building2 size={16} />
        </div>
        <div className="flex flex-col min-w-0">
          <Link
            href={`/client/${row.original.id}/contacts`}
            className="font-black text-primary leading-none hover:text-secondary transition-colors  italic uppercase tracking-tight"
          >
            {row.original.commercialName}
          </Link>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1.5 opacity-70">
            {row.original.businessName}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ruc",
    header: "RUC",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
        {row.getValue("ruc")}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => (
      <span className="text-xs text-gray-500 truncate max-w-[250px] block">
        {row.getValue("address")}
      </span>
    ),
  },
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
              ? "bg-slate-50 border-slate-100 hover:border-secondary/30 hover:bg-secondary/5"
              : "bg-slate-50/50 border-transparent opacity-40 grayscale",
          )}
        >
          <div
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center transition-colors",
              count > 0
                ? "bg-secondary text-white"
                : "bg-slate-200 text-slate-400",
            )}
          >
            <UserCircle size={12} />
          </div>
          <span
            className={cn(
              "text-[11px] font-black tracking-tighter",
              count > 0
                ? "text-slate-700 group-hover/badge:text-secondary"
                : "text-slate-400",
            )}
          >
            {count}
          </span>
          {count > 0 && (
            <ChevronRight
              size={10}
              className="text-slate-300 group-hover/badge:text-secondary group-hover/badge:translate-x-0.5 transition-all"
            />
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ActionCellClient client={row.original} />,
  },
];
