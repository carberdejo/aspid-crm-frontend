'use client';

import { ChevronRight, ArrowRight, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock temporal
const ACTIVITIES = [
  { id: 1, type: 'VISIT', client: 'Aero S.A.C.', time: 'Hace 2h' },
  { id: 2, type: 'QUOTE', client: 'SEGUR S.A.C.', time: 'Hace 5h' },
  { id: 3, type: 'VISIT', client: 'Aero S.A.C.', time: 'Ayer' },
];

export function DailyActivityCard() {
  return (
    <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col min-h-[320px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Resumen Diario
        </h3>
        <Circle className="text-secondary-text fill-secondary" size={8} />
      </div>

      <div className="space-y-3 flex-1">
        {ACTIVITIES.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all group cursor-pointer"
          >
            {/* Indicador lateral de color según tipo */}
            <div className={`w-1 h-10 rounded-full ${activity.type === 'VISIT' ? 'bg-primary' : 'bg-secondary'}`} />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-tighter ${activity.type === 'VISIT' ? 'text-primary' : 'text-secondary-text'}`}>
                  {activity.type === 'VISIT' ? 'Visita Técnica' : 'Cotización'}
                </span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[9px] text-slate-400 font-medium">{activity.time}</span>
              </div>
              <p className="text-sm font-bold text-primary uppercase truncate">
                {activity.client}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/20 transition-all">
              <ChevronRight size={14} />
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="link" 
        className="text-[10px] font-black uppercase text-secondary-text mt-4 self-start p-0 h-auto group"
      >
        Ver historial completo 
        <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}