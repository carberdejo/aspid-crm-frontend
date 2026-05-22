"use client";

import { SalesIndicatorsTable } from "./SalesIndicatorsTable";
import { SalesIndicatorsChart } from "./SalesIndicatorsChart";

interface DepartmentAnalyticsWrapperProps {
  departmentId: number;
  departmentName: string;
}

export function DepartmentAnalyticsWrapper({
  departmentId,
  departmentName,
}: DepartmentAnalyticsWrapperProps) {
  const normalizedName = departmentName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "");

  if (normalizedName === "ventas") {
    return (
      <div className="w-full space-y-6">
        {/* Pasamos únicamente el ID, ellos se encargan del resto */}
        <SalesIndicatorsTable departmentId={departmentId} />
        <SalesIndicatorsChart departmentId={departmentId} />
      </div>
    );
  }

  if (normalizedName === "desarrollodenegocio") {
    return (
      <div className="w-full space-y-6">
        {/* Pasamos únicamente el ID, ellos se encargan del resto */}
        <SalesIndicatorsTable departmentId={departmentId} />
        <SalesIndicatorsChart departmentId={departmentId} />
      </div>
    );
  }

  if (normalizedName === "proyectos") {
    return (
      <div className="w-full space-y-6">
        {/* Pasamos únicamente el ID, ellos se encargan del resto */}
        <SalesIndicatorsTable departmentId={departmentId} />
        <SalesIndicatorsChart departmentId={departmentId} />
      </div>
    );
  }

  if (normalizedName === "servicios") {
    return (
      <div className="w-full space-y-6">
        {/* Pasamos únicamente el ID, ellos se encargan del resto */}
        <SalesIndicatorsTable departmentId={departmentId} />
        <SalesIndicatorsChart departmentId={departmentId} />
      </div>
    );
  }

  return (
    <div className="p-12 text-center bg-slate-50 rounded-[2rem]">
      <p className="text-slate-400 font-medium">
        No hay gráficos configurados para {departmentName}.
      </p>
    </div>
  );
}
