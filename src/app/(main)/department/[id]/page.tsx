'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, ClipboardList, Clock, FileText, ShoppingCart, TrendingUp } from 'lucide-react';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import { VisitFlowContainer } from '@/components/visit/VisitFlowContainer';
import { OperationCards } from '@/components/department/OperationCards';
import { DailyActivityCard } from '@/components/department/DailyActivityCard';
import { QuoteSummaryCard } from '@/components/department/QuoteSummaryCard';

export default function DepartmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const { departments } = useDepartmentStore();
  const { setHeaderTitle } = useHeaderStore();

  // Obtener el nombre del departamento desde el store
  const departmentName = React.useMemo(() => {
    const dept = departments.find((d) => d.id.toString() === id);
    return dept?.name || 'Área desconocida';
  }, [departments, id]);

  // Actualizar el header cuando cambia el departamento
  useEffect(() => {
    if (departmentName && departmentName !== 'Área desconocida') {
      setHeaderTitle(`Área: ${departmentName}`);
    }
    // Al desmontar, vuelve al título por defecto
    return () => setHeaderTitle('Dashboard');
  }, [departmentName, setHeaderTitle]);

// --- MOCK DATA (Para simular el backend de NestJS) ---
const DASHBOARD_DATA = {
  quoteSummary: { revision: 3, waiting: 4, total: 7 },
  dailyActivity: [
    { type: 'VISIT', client: 'Aero S.A.C.', id: 1 },
    { type: 'QUOTE', client: 'SEGUR S.A.C.', id: 2 },
    { type: 'VISIT', client: 'Aero S.A.C.', id: 3 },
  ]
};
  return (
  <div className="space-y-6 bg-transparent">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
      
      {/* LADO IZQUIERDO: Identidad del Departamento */}
      <div className="flex flex-col">
        <h1 className="text-5xl font-black text-primary leading-none tracking-tighter lowercase">
          {departmentName}
        </h1>
        {/* Línea decorativa con gradiente sutil */}
        <div className="h-2 w-20 bg-linear-to-r from-secondary to-orange-400 mt-2 rounded-full" />
      </div>

      {/* LADO DERECHO: Acciones con Estilo Premium */}
      <div className="flex items-center gap-3">
        
        {/* BOTÓN VISITAS (Vía FlowContainer) */}
        <VisitFlowContainer 
          departmentId={+id} 
          trigger={
            <Button
              className="bg-primary hover:bg-primary text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-blue-900/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
            >
              <ClipboardList size={18} className="text-blue-100" />
              Visitas
            </Button>
          } 
        />

        {/* BOTÓN COTIZACIONES */}
        <Button
          className="bg-secondary hover:bg-orange-600 text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <FileText size={18} className="text-orange-200" />
          Cotizaciones
        </Button>

        {/* BOTÓN ORDEN DE COMPRA */}
        <Button
          className="bg-accent   hover:bg-accent-dark text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-slate-900/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
        >
          <ShoppingCart size={18} className="text-slate-400" />
          Orden de Compra
        </Button>

      </div>
    </div>

    {/* Separador con mayor elegancia */}
    <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

    
  {/* --- SECCIÓN 2: STATS SUPERIORES (EL ESQUELETO) --- */}
      {/* 2. Rejilla de Información Superior */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <QuoteSummaryCard />
        <DailyActivityCard />
        <OperationCards />
      </div>

      {/* --- SECCIÓN 3: GRÁFICO Y CALENDARIO (ESPACIOS VACÍOS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] min-h-[400px] border border-slate-50 shadow-sm p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Gráfico de Rendimiento</h3>
          <div className="flex-1 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
             <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">Área de Gráfico (Pendiente Backend)</p>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] min-h-[400px] border border-slate-50 shadow-sm p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">Agendar Fechas</h3>
          <div className="flex-1 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
             <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">Calendario (Pendiente Backend)</p>
          </div>
        </div>
      </div>
    </div>
);

// --- SUBCOMPONENTES AUXILIARES ---

function StatMiniItem({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: 'primary' | 'secondary' | 'slate' }) {
  const colorMap = {
    primary: "text-primary",
    secondary: "text-secondary",
    slate: "text-slate-400"
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${colorMap[color]} opacity-40 mb-1`}>{icon}</div>
      <span className="text-xl font-bold text-primary leading-none">{value}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center">{label}</span>
    </div>
  );
}

function QuickAccessButton({ label, color }: { label: string, color: 'primary' | 'secondary' | 'orange' }) {
  const styles = {
    primary: "border-primary text-primary hover:bg-primary hover:text-white shadow-blue-900/5",
    secondary: "border-secondary text-secondary hover:bg-secondary hover:text-white shadow-orange-500/5",
    orange: "border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white shadow-orange-700/5"
  };

  return (
    <Button 
      variant="outline" 
      className={`h-full w-full rounded-[1.8rem] border-2 font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 shadow-lg ${styles[color]}`}
    >
      {label}
    </Button>
  );
}
}