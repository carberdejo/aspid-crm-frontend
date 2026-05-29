"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Building2,
  Calendar as CalendarIcon,
  User,
  PackageOpen,
} from "lucide-react";
import { Delivery } from "@/interfaces"; // Ajusta la ruta a tu interface
import { ActionsCellDelivery } from "./ActionsCellDelivery";

export const deliveryColumns: ColumnDef<Delivery>[] = [
  {
    accessorKey: "id",
    header: "Nº Entrega / Guía",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {/* Identificador Índigo para Entregas/Logística */}
        <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
          <Truck size={14} className="text-indigo-600" />
        </div>
        <span className="font-black text-primary uppercase tracking-tighter">
          {/* Asumiendo que el ID es un UUID o código. Si es un UUID largo, puedes truncarlo: row.original.id.slice(0,8) */}
          {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "client.businessName",
    header: "Cliente / Razón Social",
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Building2 size={12} className="text-slate-400 shrink-0" />
            <span
              className="font-bold text-slate-700 uppercase text-[11px] truncate max-w-[200px]"
              title={client.businessName}
            >
              {client.businessName}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-bold tracking-widest pl-4 mt-0.5">
            RUC: {client.ruc}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Responsable",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-slate-400 shrink-0" />
          <span className="font-bold text-slate-600 uppercase text-[10px]">
            {user.firstName} {user.lastName}
          </span>
        </div>
      );
    },
  },
  {
    // Columna calculada para mostrar un resumen de los productos entregados
    id: "itemsSummary",
    header: "Contenido",
    cell: ({ row }) => {
      const items = row.original.deliveryItems || [];
      // Sumamos la cantidad total de unidades a entregar
      const totalUnits = items.reduce((sum, item) => sum + item.cantidad, 0);
      const uniqueProducts = items.length;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border-slate-200 px-2 py-0.5"
          >
            <PackageOpen size={10} className="text-indigo-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {totalUnits} Unds
            </span>
          </Badge>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            ({uniqueProducts} {uniqueProducts === 1 ? "Producto" : "Productos"})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Fecha de Entrega",
    cell: ({ row }) => {
      const dateString = row.original.deliveryDate;
      // Ajuste de zona horaria si la fecha viene en formato YYYY-MM-DD
      const date = dateString.includes("T")
        ? new Date(dateString)
        : new Date(`${dateString}T00:00:00`);

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
    id: "actions",
    header: () => (
      <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Acciones
      </div>
    ),
    cell: ({ row }) => <ActionsCellDelivery delivery={row.original} />,
  },
];
