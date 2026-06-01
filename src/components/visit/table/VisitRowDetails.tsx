"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  CheckCircle2,
} from "lucide-react";
import { VisitListItem } from "@/interfaces/visit.interface";

export function VisitRowDetails({ row }: { row: { original: VisitListItem } }) {
  const visit = row.original;

  return (
    // Rediseño del contenedor principal para que parezca una extensión natural de la fila
    <div className="bg-slate-50/50 border-b border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Añadimos un pequeño borde superior con el color temático de visitas (sky) */}
      <div className="h-0.5 w-full bg-gradient-to-r from-sky-400/10 via-sky-400 to-sky-400/10 opacity-50" />

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* COLUMNA 1: Temas Tratados (Tono Sky - Trabajo de campo) */}
          <DetailSection
            title="Temas Tratados"
            content={visit.visitTopics}
            theme="sky"
            icon={<MessageSquareQuote size={14} className="text-sky-500" />}
          />

          {/* COLUMNA 2: Resumen de Resultados (Tono Emerald - Logros/Conclusiones) */}
          <DetailSection
            title="Resumen de Resultados"
            content={visit.outcomeSummary}
            theme="emerald"
            icon={<CheckCircle2 size={14} className="text-emerald-500" />}
          />
        </div>
      </div>
    </div>
  );
}

// Componente Interno Rediseñado
function DetailSection({
  title,
  content,
  theme,
  icon,
}: {
  title: string;
  content: string;
  theme: "sky" | "emerald";
  icon: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = content && content.length > 200;

  // Clases dinámicas basadas en el tema elegido
  const themeClasses = {
    sky: {
      bg: "bg-sky-50/50",
      border: "border-sky-100",
      textTitle: "text-sky-700",
      dot: "bg-sky-400",
    },
    emerald: {
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      textTitle: "text-emerald-700",
      dot: "bg-emerald-400",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <div
      className={`p-6 rounded-2xl border transition-all ${currentTheme.bg} ${currentTheme.border}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-white rounded-lg shadow-sm">{icon}</div>
        <h4
          className={`text-[10px] font-black uppercase tracking-[0.15em] ${currentTheme.textTitle}`}
        >
          {title}
        </h4>
      </div>

      <div className="relative pl-1">
        <p
          className={`text-xs text-slate-600 leading-relaxed font-medium transition-all duration-300 ${!isExpanded && isLongText ? "line-clamp-4" : ""}`}
        >
          {content || (
            <span className="italic text-slate-400 font-normal">
              No se registraron detalles para esta sección.
            </span>
          )}
        </p>

        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200"
          >
            {isExpanded ? (
              <>
                Ocultar <ChevronUp size={12} />
              </>
            ) : (
              <>
                Leer completo <ChevronDown size={12} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
