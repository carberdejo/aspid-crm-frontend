"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { useHeaderStore } from "@/store/useHeaderStore";
import { useDepartmentStore } from "@/store/useDepartmentStore";
import { VisitFlowContainer } from "@/components/visit/VisitFlowContainer";
import { OperationCards } from "@/components/department/OperationCards";
import { DailyActivityCard } from "@/components/department/DailyActivityCard";
import { QuoteSummaryCard } from "@/components/department/QuoteSummaryCard";
import { QuoteFlowContainer } from "@/components/quote/form/QuoteFlowContainer";
import { useAuthStore, useVisitFlowStore } from "@/store";
import { VisitPerformancePanel } from "@/components/department/VisitPerformancePanel";
import { RegisterPurchaseOrderModal } from "@/components/orders/form/RegisterPurchaseOrderModal";
import { RegisterDeliveryModal } from "@/components/deliverys/RegisterDeliveryModal";
import { CreateOperationMenu } from "@/components/department/CreateOperationMenu";
import { RegisterInvoiceModal } from "@/components/invoices/form/RegisterInvoiceModal";

type OperationModalType = "order" | "delivery" | "invoice" | null;

export default function DepartmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const { getDepartmentById } = useDepartmentStore();
  const { setHeaderTitle } = useHeaderStore();
  const { user } = useAuthStore();

  const openMainFlow = useVisitFlowStore((state) => state.openMain);
  const [activeModal, setActiveModal] = useState<OperationModalType>(null);

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

  // MANEJADOR CENTRAL DE ACCIONES DEL MENÚ
  const handleMenuAction = (
    type: "visit" | "quote" | "order" | "delivery" | "invoice",
  ) => {
    if (type === "visit") openMainFlow("VISIT");
    else if (type === "quote") openMainFlow("QUOTE");
    else setActiveModal(type); // Asigna "order", "delivery" o "invoice"
  };

  return (
    <div className="space-y-6 bg-transparent">
      <PageHeader
        title={department.name}
        subtitle="Gestión de Operaciones"
        icon={Briefcase}
        themeColor="corporate"
        variant="compact"
        // PASAMOS EL MENÚ Y LOS MODALES INVISIBLES COMO UN SOLO BLOQUE DE ACCIÓN
        action={
          <div className="flex items-center gap-4">
            {/* 1. EL BOTÓN VISIBLE (Menú Desplegable) */}
            <CreateOperationMenu onAction={handleMenuAction} />

            {/* 2. LOS MODALES INVISIBLES */}
            {/* Flujos controlados por Zustand */}
            <VisitFlowContainer departmentId={+id} trigger={null} />
            <QuoteFlowContainer departmentId={+id} trigger={null} />

            {/* Modales controlados por estado local */}
            <RegisterPurchaseOrderModal
              open={activeModal === "order"}
              onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}
              hideTrigger={true}
              departmentId={department.id}
            />
            <RegisterDeliveryModal
              open={activeModal === "delivery"}
              onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}
              hideTrigger={true}
            />
            <RegisterInvoiceModal
              open={activeModal === "invoice"}
              onOpenChange={(isOpen) => !isOpen && setActiveModal(null)}
              hideTrigger={true}
              departmentId={department.id}
            />
          </div>
        }
      />

      {/* --- SECCIÓN 2: STATS SUPERIORES --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Tarjeta 1: Resumen Cotizaciones (Ahora ocupa 5 columnas - MÁS GRANDE) */}
        <div className="xl:col-span-4 flex flex-col">
          <QuoteSummaryCard userId={user?.sub ?? 0} />
        </div>

        {/* Tarjeta 2: Rendimiento Visitas (Ahora ocupa 3 columnas - COMPACTO) */}
        <div className="xl:col-span-4 flex flex-col">
          <VisitPerformancePanel userId={user?.sub ?? 0} />
        </div>

        {/* Tarjeta 3: Panel Bento (Ocupa 4 columnas) */}
        <div className="xl:col-span-4 flex flex-col">
          <OperationCards departmentId={+id} />
        </div>
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
          {/* <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-left">
            Agendar Fechas
          </h3> */}
          {/* <div className="flex-1 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
            <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
              Calendario (Pendiente Backend)
            </p>
          </div> */}
          <DailyActivityCard />
        </div>
      </div>
    </div>
  );
}
