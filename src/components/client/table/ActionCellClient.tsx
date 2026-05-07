"use client";

import {
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  FileText,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface ActionCellClientProps {
  client: any;
}

export function ActionCellClient({ client }: ActionCellClientProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      {/* ACCIONES DIRECTAS (Un solo clic) */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
        onClick={() => router.push(`/client/${client.id}/contacts`)}
        title="Ver Detalle"
      >
        <Eye size={16} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-secondary hover:bg-secondary/5 transition-colors"
        onClick={() => console.log("Editar", client.id)}
        title="Editar"
      >
        <Edit size={16} />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        onClick={() => console.log("Eliminar", client.id)}
        title="Eliminar"
      >
        <Trash2 size={16} />
      </Button>

      {/* MENÚ DE OPERACIONES (Tres puntos) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl p-2 shadow-xl border-slate-100"
        >
          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-400 px-2 py-1.5">
            Operaciones ACME
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-50" />

          <DropdownMenuItem
            className="gap-2 px-3 py-2.5 cursor-pointer rounded-lg font-bold text-xs text-slate-600 hover:text-primary transition-colors"
            onClick={() =>
              router.push(`/dashboard/clients/${client.id}/visits`)
            }
          >
            <MapPin size={14} className="text-slate-400" /> Visitas Técnicas
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-2 px-3 py-2.5 cursor-pointer rounded-lg font-bold text-xs text-slate-600 hover:text-primary transition-colors"
            onClick={() =>
              router.push(`/dashboard/clients/${client.id}/quotes`)
            }
          >
            <FileText size={14} className="text-slate-400" /> Cotizaciones
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-2 px-3 py-2.5 cursor-pointer rounded-lg font-bold text-xs text-slate-600 hover:text-primary transition-colors"
            onClick={() =>
              router.push(`/dashboard/clients/${client.id}/orders`)
            }
          >
            <ShoppingCart size={14} className="text-slate-400" /> Órdenes de
            Compra (OC)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
