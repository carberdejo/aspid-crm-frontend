"use client";

import React from "react";
import Link from "next/link"; // 1. Importar Link
import { useParams } from "next/navigation"; // Para obtener el ID del departamento actual
import {
  ClipboardList,
  FileText,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

export enum ColorVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ORANGE = "orange",
}
export function OperationCards() {
  const params = useParams();
  const id = params?.id;

  // Definimos las rutas relativas al departamento actual
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
    <div className="lg:col-span-3 flex flex-col justify-between gap-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
        Gestión de Operaciones
      </h3>
      {operations.map((op) => (
        <QuickNavItem
          key={op.label}
          label={op.label}
          description={op.description}
          color={op.color}
          icon={op.icon}
          href={op.href} // Pasamos la ruta
        />
      ))}
    </div>
  );
}

// 2. Ajustamos el Helper para que use el Link
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
  const colorMap = {
    [ColorVariant.PRIMARY]:
      "bg-primary/10 text-primary hover:border-primary/40",
    [ColorVariant.SECONDARY]:
      "bg-secondary/10 text-secondary hover:border-secondary/40",
    [ColorVariant.ORANGE]:
      "bg-orange-50 text-orange-600 hover:border-orange-500/40",
  };

  return (
    <Link href={href}>
      {" "}
      {/* 👈 Envolvemos todo el contenido */}
      <div
        className={`group flex items-center gap-4 p-4 rounded-[1.8rem] border-2 border-transparent bg-white shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md ${colorMap[color as keyof typeof colorMap]}`}
      >
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorMap[color as keyof typeof colorMap].split(" ")[0]}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold uppercase tracking-tight text-slate-800">
            {label}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {description}
          </span>
        </div>
        <ChevronRight
          size={16}
          className="ml-auto text-slate-300 group-hover:text-current transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
