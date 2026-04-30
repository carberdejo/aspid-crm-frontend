"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quote, QuoteStatus } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { ActionsCell } from "./ActionsCell";

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
        <span className="text-[9px] text-slate-400 font-medium tracking-wider">
          RUC: {row.original.client.ruc}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Monto Total",
    cell: ({ row }) => (
      <span className="font-black text-primary text-[13px]">
        {currencyFormatter.format(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      // Colores solicitados: Ámbar (Pendiente), Rojo (Rechazado), Verde (Aprobado)
      const statusStyles: Record<string, string> = {
        [QuoteStatus.PENDIENTE]: "bg-amber-50 text-amber-600 border-amber-200",
        [QuoteStatus.APROBADO]:
          "bg-emerald-50 text-emerald-600 border-emerald-200",
        [QuoteStatus.RECHAZADO]: "bg-rose-50 text-rose-600 border-rose-200",
      };

      return (
        <Badge
          variant="outline"
          className={`text-[9px] font-black uppercase px-2 py-0.5 border ${statusStyles[status] || "bg-slate-50 text-slate-500"}`}
        >
          {status === QuoteStatus.PENDIENTE
            ? QuoteStatus.PENDIENTE
            : status === QuoteStatus.APROBADO
              ? QuoteStatus.APROBADO
              : QuoteStatus.RECHAZADO}
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
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
          {date.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => <ActionsCell quote={row.original} />,

    // cell: ({ row }) => (
    //   <div className="flex items-center justify-center gap-1">
    //     <TooltipProvider delayDuration={0}>
    //       {/* VER DETALLE */}
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
    //           >
    //             <Eye size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent className="bg-primary text-white text-[10px] font-bold uppercase">
    //           Ver Detalle
    //         </TooltipContent>
    //       </Tooltip>

    //       {/* PDF */}
    //       {/* <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="h-8 w-8 text-slate-400 hover:text-secondary hover:bg-secondary/5 rounded-full transition-colors"
    //           >
    //             <FileText size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent className="bg-secondary text-white text-[10px] font-bold uppercase">
    //           Descargar PDF
    //         </TooltipContent>
    //       </Tooltip> */}

    //       {/* EDITAR */}
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
    //           >
    //             <Edit3 size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent className="bg-blue-600 text-white text-[10px] font-bold uppercase">
    //           Editar
    //         </TooltipContent>
    //       </Tooltip>

    //       {/* ELIMINAR */}
    //       <Tooltip>
    //         <TooltipTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             size="icon"
    //             className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
    //           >
    //             <Trash2 size={16} />
    //           </Button>
    //         </TooltipTrigger>
    //         <TooltipContent className="bg-rose-600 text-white text-[10px] font-bold uppercase">
    //           Eliminar
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   </div>
    // ),
  },
];
