"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "primary" | "secondary" | "accent";
  count?: number;
  countLabel?: string;
  action?: React.ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

/**
 * Componente profesional para encabezados de página
 * Proporciona una interfaz consistente y moderna para las páginas de CRM
 */
export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "primary",
  count,
  countLabel = "elementos",
  action,
  variant = "default",
  className,
}: PageHeaderProps) {
  const colorMap = {
    primary: "bg-[#1a2a53] text-white",
    secondary: "bg-[#ea6839] text-white",
    accent: "bg-[#f8aa19] text-[#1a2a53]",
  };

  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isCompact ? "mb-6" : "mb-8",
        className,
      )}
    >
      {/* Fondo decorativo sutil con gradiente */}
      {!isCompact && (
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2a53] via-[#ea6839] to-[#f8aa19]" />
          <svg
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-10"
            width="400"
            height="400"
            viewBox="0 0 400 400"
            fill="none"
          >
            <circle
              cx="200"
              cy="200"
              r="150"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="100"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="200"
              cy="200"
              r="50"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative flex items-center justify-between gap-6">
        {/* Sección izquierda: Icon + Textos */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {Icon && !isCompact && (
            <div
              className={cn(
                "flex-shrink-0 p-3 rounded-xl shadow-lg",
                "ring-1 ring-offset-2 ring-offset-white transition-all duration-300 hover:shadow-xl hover:ring-offset-4",
                colorMap[iconColor],
              )}
            >
              <Icon size={24} className="flex-shrink-0" />
            </div>
          )}

          {Icon && isCompact && (
            <div
              className={cn(
                "p-2 rounded-lg flex-shrink-0",
                colorMap[iconColor],
              )}
            >
              <Icon size={18} />
            </div>
          )}

          {/* Textos */}
          <div className="flex-1 min-w-0">
            {/* Título */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1
                className={cn(
                  "font-black text-primary uppercase tracking-tight leading-tight",
                  isCompact ? "text-2xl" : "text-4xl",
                )}
              >
                {title}
              </h1>

              {/* Badge de conteo */}
              {count !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
                    "bg-[#f8aa19] text-[#1a2a53] ring-1 ring-offset-1 ring-[#f8aa19]",
                    isCompact && "px-2 py-0.5 text-xs",
                  )}
                >
                  {count} {countLabel}
                </span>
              )}
            </div>

            {/* Subtítulo */}
            {subtitle && (
              <p
                className={cn(
                  "text-muted-foreground font-semibold uppercase tracking-wider",
                  isCompact ? "text-xs mt-1" : "text-sm mt-2",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Acción (derecha) */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Línea decorativa inferior */}
      <div className="h-1 bg-gradient-to-r from-[#1a2a53] via-[#ea6839] to-transparent mt-4 rounded-full" />
    </div>
  );
}
