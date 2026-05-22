"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ClipboardList,
  FileText,
  ShoppingCart,
  ChevronRight,
  LayoutGrid, // Un ícono extra para el encabezado del panel
} from "lucide-react";

export enum ColorVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ORANGE = "orange",
}

export function OperationCards() {
  const params = useParams();
  const id = params?.id;

  const operations = [
    {
      label: "Módulo de Visitas",
      description: "Historial técnico",
      color: ColorVariant.PRIMARY,
      icon: <ClipboardList size={22} />,
      href: `/department/${id}/visit`,
    },
    {
      label: "Cotizaciones",
      description: "Presupuestos",
      color: ColorVariant.SECONDARY,
      icon: <FileText size={22} />,
      href: `/department/${id}/quote`,
    },
    {
      label: "Órdenes de Compra",
      description: "Estado de ventas",
      color: ColorVariant.ORANGE,
      icon: <ShoppingCart size={22} />,
      href: `/department/${id}/order`,
    },
  ];

  return (
    // 1. EL CONTENEDOR DEL PANEL: Fondo sutil y bordes para separarlo del resto del dashboard
    <div className="lg:col-span-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-5 px-1">
        <LayoutGrid size={16} className="text-slate-400" />
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Panel de Operaciones
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {operations.map((op) => (
          <QuickNavItem
            key={op.label}
            label={op.label}
            description={op.description}
            color={op.color}
            icon={op.icon}
            href={op.href}
          />
        ))}
      </div>
    </div>
  );
}

type QuickNavItemProps = {
  label: string;
  description: string;
  color: ColorVariant;
  icon: React.ReactNode;
  href: string;
};

function QuickNavItem({
  label,
  description,
  color,
  icon,
  href,
}: QuickNavItemProps) {
  // 2. MAPA DE ESTILOS MEJORADO: Separamos el fondo del ícono, el borde del hover y la línea de acento
  const styleMap = {
    [ColorVariant.PRIMARY]: {
      iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
      hoverBorder: "hover:border-blue-300",
      accentLine: "bg-blue-500",
    },
    [ColorVariant.SECONDARY]: {
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
      hoverBorder: "hover:border-emerald-300",
      accentLine: "bg-emerald-500",
    },
    [ColorVariant.ORANGE]: {
      iconBg: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
      hoverBorder: "hover:border-orange-300",
      accentLine: "bg-orange-500",
    },
  };

  const styles = styleMap[color as keyof typeof styleMap];

  return (
    <Link href={href} className="block outline-none">
      <div
        className={`group relative flex items-center gap-4 p-3 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md ${styles.hoverBorder} overflow-hidden`}
      >
        {/* LÍNEA DE ACENTO LATERAL: Aparece en hover para dar feedback visual de interactividad */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.accentLine} opacity-0 group-hover:opacity-100 transition-opacity`}
        />

        <div
          className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors ${styles.iconBg}`}
        >
          {icon}
        </div>

        {/* Usamos min-w-0 y truncate para proteger el layout en pantallas estrechas */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-bold text-slate-800 truncate">
            {label}
          </span>
          <span className="text-xs text-slate-400 font-medium truncate mt-0.5">
            {description}
          </span>
        </div>

        {/* Círculo indicador para la flecha, hace que parezca más un botón de acción */}
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors shrink-0">
          <ChevronRight
            size={16}
            className="text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
