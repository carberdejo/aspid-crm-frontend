'use client';

import { useState } from 'react';
import {  ChevronDown, ChevronUp } from 'lucide-react';
import { VisitListItem } from '@/interfaces/visit.interface';

export function VisitRowDetails({ row }: { row: { original: VisitListItem } }) {
  const visit = row.original;
  
  return (
    <div className="p-8 bg-slate-50/80 border-x border-b border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA 1: Temas Tratados */}
        <div className="lg:col-span-5 space-y-3">
          <DetailSection 
            title="Temas Tratados" 
            content={visit.visitTopics} 
            color="secondary" 
          />
        </div>

        {/* COLUMNA 2: Resumen de Resultados */}
        <div className="lg:col-span-5 space-y-3">
          <DetailSection 
            title="Resumen de Resultados" 
            content={visit.outcomeSummary} 
            color="primary" 
          />
        </div>

      </div>
    </div>
  );
}

// Componente Interno para las secciones con "Ver más"
function DetailSection({ title, content, color }: { title: string, content: string, color: 'primary' | 'secondary' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Si el texto es corto, no mostramos el botón de expandir
  const isLongText = content.length > 180;

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm transition-all">
      <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ${color === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${color === 'secondary' ? 'bg-secondary' : 'bg-primary'}`} />
        {title}
      </h4>
      
      <div className="relative">
        <p className={`text-sm text-slate-600 leading-relaxed font-medium transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''}`}>
          {content || "No se registró información adicional."}
        </p>

        {isLongText && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[10px] font-bold uppercase text-slate-400 hover:text-secondary flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp size={12} /></>
            ) : (
              <>... Ver más <ChevronDown size={12} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}