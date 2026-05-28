"use client";

import {
  Plus,
  ClipboardList,
  FileText,
  ShoppingCart,
  Truck,
  Receipt,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreateOperationMenuProps {
  onAction: (
    type: "visit" | "quote" | "order" | "delivery" | "invoice",
  ) => void;
}

export function CreateOperationMenu({ onAction }: CreateOperationMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-secondary hover:bg-secondary/95 text-white font-black h-11 px-6 rounded-xl flex gap-2.5 shadow-lg shadow-primary/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
          <Plus size={14} strokeWidth={3} />
          Nueva Operación
          <ChevronDown size={12} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-2xl shadow-xl border-slate-100 bg-white"
      >
        {/* GRUPO 1: ACTIVIDAD EN CAMPO */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-1.5">
            Actividad en Campo
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onAction("visit")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
              <ClipboardList size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Visita
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Registro de inspección
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-50 my-1" />

        {/* GRUPO 2: GESTIÓN COMERCIAL */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-1.5 mt-1">
            Gestión Comercial
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onAction("quote")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
              <FileText size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Cotización
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Presupuesto formal
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAction("order")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
              <ShoppingCart size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Orden de Compra
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Confirmación de cliente
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-50 my-1" />

        {/* GRUPO 3: DESPACHO Y CIERRE */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-2 py-1.5 mt-1">
            Despacho y Cierre
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onAction("delivery")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
              <Truck size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Guía de Remisión
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Registro de entrega
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAction("invoice")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 focus:bg-slate-50 group transition-colors"
          >
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 group-hover:text-rose-700 transition-colors">
              <Receipt size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-700 uppercase">
                Facturación
              </span>
              <span className="text-[9px] font-medium text-slate-400">
                Emisión de comprobante
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
