"use client";

import { BarChart3 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { DepartmentAnalyticsWrapper } from "@/components/analytics/DepartmentAnalyticsWrapper";
import { useDepartmentStore } from "@/store";
// Asume que tienes una función para traer los departamentos activos (la misma que usas para el nav)

// Normalizador idéntico al de tu navItems.ts para asegurar que los IDs coincidan
const normalizeId = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

export default function AnalyticsPage() {
  // Obtenemos los departamentos en el servidor
  const { departments } = useDepartmentStore();
  const validDepartments = departments.filter(
    (dept) => dept.isActive && normalizeId(dept.name) !== "administracion",
  );

  return (
    <div className="p-6 space-y-24 animate-in fade-in duration-500">
      <PageHeader
        title="Analítica General"
        subtitle="Visión consolidada de rendimiento por departamento"
        icon={BarChart3}
        themeColor="corporate"
      />

      {/* Renderizado dinámico de secciones con ScrollSpy nativo */}
      <div className="space-y-32">
        {validDepartments.map((dept) => (
          <section
            key={dept.id}
            id={normalizeId(dept.name)} // Coincide exactamente con el href del Sidebar
            className="scroll-mt-24" // Margen superior para que no lo tape tu navbar
          >
            <div className="mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Reportes de {dept.name}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">
                Indicadores clave y métricas de rendimiento
              </p>
            </div>

            {/* Este componente envolverá todos los gráficos específicos de este departamento */}
            <DepartmentAnalyticsWrapper
              departmentId={dept.id}
              departmentName={dept.name}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
