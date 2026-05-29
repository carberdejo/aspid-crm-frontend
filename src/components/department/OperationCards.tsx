"use client";

import {
  ClipboardList,
  FileText,
  ShoppingCart,
  Truck,
  Receipt,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
interface OperationCardsProps {
  // Aquí podrías agregar props si necesitas pasar datos dinámicos a las tarjetas
  departmentId: number; // Ejemplo de prop para construir URLs dinámicas
}
export function OperationCards({ departmentId }: OperationCardsProps) {
  return (
    <div className="w-full bg-white rounded-[2.5rem] border border-slate-50 shadow-sm p-5 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      {" "}
      {/* Cabecera del Panel */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-2">
          <LayoutGrid size={16} className="text-slate-400" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Panel de Operaciones
          </h3>
        </div>
      </div>
      {/* Grid Bento */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* 1. VISITAS (Destacado - Ocupa 2 columnas) */}
        <OperationCard
          title="Visitas"
          subtitle="Historial de visitas"
          icon={ClipboardList}
          colorClass="text-blue-600 bg-blue-50/80 border-blue-100 hover:bg-blue-100/80"
          href={`/department/${departmentId}/visit`} // TODO: Agrega la ruta hacia tu vista de tabla de visitas
          isWide={true}
        />

        {/* 2. COTIZACIONES */}
        <OperationCard
          title="Cotizaciones"
          subtitle="Presupuestos"
          icon={FileText}
          colorClass="text-orange-600 bg-orange-50/80 border-orange-100 hover:bg-orange-100/80"
          href={`/department/${departmentId}/quote`}
        />

        {/* 3. ÓRDENES DE COMPRA */}
        <OperationCard
          title="Órdenes"
          subtitle="Aprobaciones"
          icon={ShoppingCart}
          colorClass="text-emerald-600 bg-emerald-50/80 border-emerald-100 hover:bg-emerald-100/80"
          href={`/department/${departmentId}/order`}
        />

        {/* 4. GUÍAS DE REMISIÓN */}
        <OperationCard
          title="Entregas"
          subtitle="Registro de entregas"
          icon={Truck}
          colorClass="text-purple-600 bg-purple-50/80 border-purple-100 hover:bg-purple-100/80"
          href={`/department/${departmentId}/delivery`}
        />

        {/* 5. FACTURACIÓN */}
        <OperationCard
          title="Facturación"
          subtitle="Comprobantes"
          icon={Receipt}
          colorClass="text-rose-600 bg-rose-50/80 border-rose-100 hover:bg-rose-100/80"
          href={`/department/${departmentId}/invoice`}
        />
      </div>
    </div>
  );
}

// Sub-componente interno para mantener el código limpio (Reutilizable)
interface OperationCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  colorClass: string;
  href: string;
  isWide?: boolean;
}

function OperationCard({
  title,
  subtitle,
  icon: Icon,
  colorClass,
  href,
  isWide = false,
}: OperationCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between p-4 rounded-[1.5rem] border transition-all duration-300 hover:shadow-md cursor-pointer ${colorClass} ${
        isWide ? "col-span-2" : "col-span-1"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        {/* Ícono con efecto de flotación al hacer hover */}
        <div className="p-2.5 rounded-xl bg-white/70 shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all duration-300">
          <Icon size={18} strokeWidth={2.5} />
        </div>

        {/* Flecha indicadora de navegación */}
        <ArrowUpRight
          size={16}
          className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 duration-300"
        />
      </div>

      <div>
        <h4 className="font-black text-slate-800 text-xs tracking-tight">
          {title}
        </h4>
        <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mt-1 truncate">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}
