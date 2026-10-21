"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Añadimos "corporate" para mantener tus colores base en el resto del sistema
type ThemeColor =
  | "corporate"
  | "emerald"
  | "orange"
  | "rose"
  | "indigo"
  | "sky"
  | "slate";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  themeColor?: ThemeColor;
  count?: number;
  countLabel?: string;
  action?: React.ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  themeColor = "corporate", // Por defecto usará tus colores corporativos
  count,
  countLabel = "registros",
  action,
  variant = "default",
  className,
}: PageHeaderProps) {
  const isCompact = variant === "compact";

  // Mapeo de estilos basados en el tema elegido
  // Mantenemos tu paleta corporativa y añadimos las de los módulos operativos
  const themeStyles = {
    corporate: {
      iconBg: "border-primary/20 text-primary",
      badge: "bg-accent text-primary shadow-sm border border-accent/50",
      highlight: "text-secondary-text",
      bgSolid: "bg-secondary",
      gradientLine: "from-primary via-secondary to-transparent",
    },
    emerald: {
      iconBg: "border-emerald-200 text-emerald-600",
      badge: "bg-emerald-100 text-emerald-800",
      highlight: "text-emerald-500",
      bgSolid: "bg-emerald-500",
      gradientLine: "from-emerald-700 via-emerald-400 to-transparent",
    },
    orange: {
      iconBg: "border-orange-200 text-orange-600",
      badge: "bg-orange-100 text-orange-800",
      highlight: "text-orange-500",
      bgSolid: "bg-orange-500",
      gradientLine: "from-orange-700 via-orange-400 to-transparent",
    },
    rose: {
      iconBg: "border-rose-200 text-rose-600",
      badge: "bg-rose-100 text-rose-800",
      highlight: "text-rose-500",
      bgSolid: "bg-rose-500",
      gradientLine: "from-rose-700 via-rose-400 to-transparent",
    },
    indigo: {
      iconBg: "border-indigo-200 text-indigo-600",
      badge: "bg-indigo-100 text-indigo-800",
      highlight: "text-indigo-500",
      bgSolid: "bg-indigo-500",
      gradientLine: "from-indigo-700 via-indigo-400 to-transparent",
    },
    sky: {
      iconBg: "border-sky-200 text-sky-600",
      badge: "bg-sky-100 text-sky-800",
      highlight: "text-sky-500",
      bgSolid: "bg-sky-500",
      gradientLine: "from-sky-700 via-sky-400 to-transparent",
    },
    slate: {
      iconBg: "border-slate-200 text-slate-600",
      badge: "bg-slate-100 text-slate-800",
      highlight: "text-slate-500",
      bgSolid: "bg-slate-500",
      gradientLine: "from-slate-700 via-slate-400 to-transparent",
    },
  };

  const currentTheme = themeStyles[themeColor];

  return (
    <div
      className={cn(
        "relative w-full flex flex-col",
        isCompact ? "mb-6" : "mb-8",
        className,
      )}
    >
      {/* Contenedor Flex adaptativo para Móviles y Desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 w-full">
        {/* Lado Izquierdo: Icono + Textos */}
        <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
          {Icon && (
            <div className="relative flex-shrink-0 group cursor-default mt-1 sm:mt-0">
              {/* NUEVO DISEÑO DE ICONO: Sombra dura desplazada (Brutalismo moderno) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-[1.25rem_0.5rem_1.25rem_0.5rem] opacity-20 translate-x-1.5 translate-y-1.5 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2",
                  currentTheme.bgSolid,
                )}
              />

              {/* Contenedor principal con geometría asimétrica */}
              <div
                className={cn(
                  "relative flex items-center justify-center bg-white border shadow-sm rounded-[1rem_0.25rem_1rem_0.25rem] md:rounded-[1.25rem_0.5rem_1.25rem_0.5rem] transition-all duration-300 z-10",
                  isCompact ? "w-10 h-10" : "w-12 h-12 md:w-14 md:h-14",
                  currentTheme.iconBg,
                )}
              >
                <Icon size={isCompact ? 20 : 26} strokeWidth={2.5} />
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center min-w-0 pt-1 sm:pt-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className={cn(
                  "font-black text-slate-800 uppercase tracking-tighter truncate leading-none",
                  isCompact
                    ? "text-xl md:text-2xl"
                    : "text-2xl md:text-3xl lg:text-4xl",
                )}
              >
                {!isCompact && title.length > 0 ? (
                  <>
                    <span className={currentTheme.highlight}>
                      {title.charAt(0)}
                    </span>
                    {title.slice(1)}
                  </>
                ) : (
                  title
                )}
              </h1>

              {count !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest ml-1 md:ml-2",
                    currentTheme.badge,
                  )}
                >
                  {count} {countLabel}
                </span>
              )}
            </div>

            {subtitle && (
              <p
                className={cn(
                  "text-slate-400 font-bold uppercase tracking-widest mt-1 md:mt-1.5 truncate max-w-[280px] sm:max-w-full",
                  isCompact ? "text-[9px]" : "text-[10px] md:text-xs",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Lado Derecho: Acciones */}
        {action && (
          <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
            {action}
          </div>
        )}
      </div>

      {/* RECUPERAMOS LA LÍNEA ANTIGUA: 
          Utiliza el gradiente corporativo para el tema 'corporate', 
          o los colores del módulo respectivo adaptándose a la misma estética de barra gruesa. 
      */}
      <div
        className={cn(
          "h-1.5 mt-5 md:mt-6 rounded-full w-full bg-gradient-to-r",
          currentTheme.gradientLine,
        )}
      />
    </div>
  );
}
