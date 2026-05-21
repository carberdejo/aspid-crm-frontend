"use client";

import { QuoteSummaryCard } from "../department/QuoteSummaryCard";
import SalesIndicatorsDashboard from "../reports/SalesIndicatorsDashboard";
import { SalesIndicatorsChart } from "./SalesIndicatorsChart";
import { SalesIndicatorsTable } from "./SalesIndicatorsTable";

// Importa tus otros reportes aquí...

interface DepartmentAnalyticsWrapperProps {
  departmentId: number;
  departmentName: string;
}

export function DepartmentAnalyticsWrapper({
  departmentId,
  departmentName,
}: DepartmentAnalyticsWrapperProps) {
  // Normalizamos solo para saber qué bloque renderizar internamente
  const normalizedName = departmentName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // Caso: VENTAS
  if (normalizedName === "ventas") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {/* El panel de visitas que optimizamos (asumimos que ocupa más ancho) */}
          {/* <VisitPerformancePanel userId={0} />{" "} */}
          <SalesIndicatorsTable />
          {/* Ojo: Ajusta cómo pasas el userId si es general */}
        </div>
        <div className="lg:col-span-4">
          {/* El panel de dinero que optimizamos */}
          <QuoteSummaryCard userId={0} />
        </div>
      </div>
    );
  }

  // Caso: PROYECTOS
  if (normalizedName === "proyectos") {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
        <p className="text-slate-400 font-bold uppercase tracking-widest">
          Módulo de Proyectos en Construcción
          {/* <SalesIndicatorsDashboard /> */}
          <SalesIndicatorsTable />
          <SalesIndicatorsChart />
        </p>
      </div>
    );
  }

  // Fallback por defecto para áreas que aún no tienen reportes diseñados
  return (
    <div className="p-12 text-center bg-slate-50 rounded-[2rem]">
      <p className="text-slate-400 font-medium">
        No hay gráficos configurados actualmente para el área de{" "}
        {departmentName}.
      </p>
    </div>
  );
}
