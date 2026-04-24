'use client';

import { FileText, Clock, TrendingUp } from "lucide-react";

// Mock temporal - Luego esto vendrá por props o un fetch
const DATA = { revision: 3, waiting: 4, total: 7 };

export function QuoteSummaryCard() {
  return (
    <div className="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col items-center justify-center min-h-[320px]">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
        Resumen de Cotizaciones
      </h3>
      
      <div className="relative">
        {/* El número principal con tracking extra apretado para verse más pro */}
        <span className="text-8xl font-black text-primary tracking-tighter leading-none">
          {DATA.total}
        </span>
        {/* Indicador de actividad (Naranja ACME) */}
        <div className="absolute -top-1 -right-2 h-4 w-4 bg-secondary rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]" />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-10 w-full border-t border-slate-50 pt-8">
        <MiniStatItem 
          label="Revisión" 
          value={DATA.revision} 
          icon={<Clock size={14} />} 
          variant="slate" 
        />
        <MiniStatItem 
          label="Esperando" 
          value={DATA.waiting} 
          icon={<FileText size={14} />} 
          variant="orange" 
        />
        <MiniStatItem 
          label="Total" 
          value={DATA.total} 
          icon={<TrendingUp size={14} />} 
          variant="blue" 
        />
      </div>
    </div>
  );
}

function MiniStatItem({ label, value, icon, variant }: { label: string, value: number, icon: React.ReactNode, variant: 'slate' | 'orange' | 'blue' }) {
  const colors = {
    slate: "text-slate-400 bg-slate-50",
    orange: "text-secondary bg-orange-50",
    blue: "text-primary bg-blue-50"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`p-2 rounded-xl ${colors[variant]}`}>
        {icon}
      </div>
      <span className="text-xl font-black text-primary">{value}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight text-center">
        {label}
      </span>
    </div>
  );
}