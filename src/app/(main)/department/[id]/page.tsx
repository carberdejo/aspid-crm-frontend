"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, ShoppingCart } from "lucide-react";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { VisitFlowContainer } from "@/components/visit/VisitFlowContainer";
import { OperationCards } from "@/components/department/OperationCards";
import { DailyActivityCard } from "@/components/department/DailyActivityCard";
import { QuoteSummaryCard } from "@/components/department/QuoteSummaryCard";
import { QuoteFlowContainer } from "@/components/quote/form/QuoteFlowContainer";
import { useAuthStore } from "@/store";

export default function DepartmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const { getDepartmentById } = useDepartmentStore();
  const { setHeaderTitle } = useHeaderStore();
  const { user } = useAuthStore(); // Para obtener el userId y pasarlo a QuoteSummaryCard (pendiente)

  // ✅ SIMPLIFICADO: Solo obtener datos del store (ya validados por middleware)
  const department = getDepartmentById(Number(id));

  // Actualizar el header cuando cambia el departamento
  useEffect(() => {
    if (department) {
      setHeaderTitle(`Área: ${department.name}`);
    }

    return () => setHeaderTitle("Dashboard");
  }, [department, setHeaderTitle]);

  // Si no encontramos el departamento, esto NO debería pasar
  // (Middleware ya validó que existe antes de llegar aquí)
  // Pero como fallback, mostrar algo
  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Departamento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        {/* LADO IZQUIERDO: Identidad del Departamento */}
        <PageHeader
          title={department.name}
          subtitle="Gestión de Operaciones"
          icon={Briefcase}
          iconColor="primary"
          variant="compact"
        />

        {/* LADO DERECHO: Acciones con Estilo Premium */}
        <div className="flex items-center gap-3">
          {/* BOTÓN VISITAS (Vía FlowContainer) */}
          <VisitFlowContainer
            departmentId={+id}
            trigger={
              <Button className="bg-primary hover:bg-primary text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-blue-900/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                <ClipboardList size={18} className="text-blue-100" />
                Visitas
              </Button>
            }
          />

          {/* BOTÓN COTIZACIONES */}
          <QuoteFlowContainer
            departmentId={+id}
            trigger={
              <Button className="bg-secondary hover:bg-orange-600 text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                <FileText size={18} className="text-orange-200" />
                Cotizaciones
              </Button>
            }
          />

          {/* BOTÓN ORDEN DE COMPRA */}
          <Button className="bg-accent hover:bg-accent-dark text-white font-black h-12 px-6 rounded-2xl flex gap-3 shadow-lg shadow-slate-900/10 transition-all active:scale-95 uppercase tracking-widest text-[10px]">
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
        <QuoteSummaryCard userId={user?.sub ?? 0} />
        <DailyActivityCard />
        <OperationCards />
      </div>

      {/* --- SECCIÓN 3: GRÁFICO Y CALENDARIO (ESPACIOS VACÍOS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] min-h-[400px] border border-slate-50 shadow-sm p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">
            Gráfico de Rendimiento
          </h3>
          <div className="flex-1 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
              Área de Gráfico (Pendiente Backend)
            </p>
          </div>
        </div>
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] min-h-[400px] border border-slate-50 shadow-sm p-8 flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">
            Agendar Fechas
          </h3>
          <div className="flex-1 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
              Calendario (Pendiente Backend)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
