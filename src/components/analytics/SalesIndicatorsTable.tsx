"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { analyticsMockData } from "./mock-analytics.data"; // Tu mock de datos

// Formateadores
const formatUSD = (val: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    val,
  );
const formatPct = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(val);

export function SalesIndicatorsTable({
  departmentId,
}: {
  departmentId: number;
}) {
  // ⏳ FUTURO HOOK:
  // const { data, isLoading } = useQuery({
  //   queryKey: ['sales-indicators', departmentId],
  //   queryFn: () => fetchSalesIndicators(departmentId)
  // });

  // Usamos tu mock directamente por ahora
  const data = analyticsMockData;

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const toggleRow = (id: number) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-black text-slate-800">
          Cuadro de Indicadores - Asesores
        </h3>
        <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
          Meta Base: $35,000.00
        </span>
      </div>

      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead className="font-bold text-slate-600 text-xs tracking-wider">
              ASESOR
            </TableHead>
            <TableHead className="text-right font-bold text-slate-600 text-xs tracking-wider">
              VISITAS
            </TableHead>
            <TableHead className="text-right font-bold text-slate-600 text-xs tracking-wider">
              ENTREGAS
            </TableHead>
            <TableHead className="text-right font-bold text-slate-600 text-xs tracking-wider">
              COTIZADO
            </TableHead>
            <TableHead className="text-right font-bold text-slate-600 text-xs tracking-wider">
              OC PENDIENTE
            </TableHead>
            <TableHead className="text-right font-bold text-slate-600 text-xs tracking-wider">
              FACTURADO
            </TableHead>
            <TableHead className="text-center font-bold text-slate-600 text-xs tracking-wider">
              RATIO
            </TableHead>
            <TableHead className="text-center font-bold text-slate-600 text-xs tracking-wider">
              CUMPLIMIENTO
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              {/* FILA PRINCIPAL (TOTALES) */}
              <TableRow
                className="cursor-pointer hover:bg-slate-50 transition-colors group"
                onClick={() => toggleRow(row.id)}
              >
                <TableCell>
                  {expandedRows[row.id] ? (
                    <ChevronDown size={18} className="text-primary" />
                  ) : (
                    <ChevronRight
                      size={18}
                      className="text-slate-400 group-hover:text-primary"
                    />
                  )}
                </TableCell>
                <TableCell className="font-black text-slate-800 whitespace-nowrap">
                  {row.asesor}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {row.total.visitas}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {row.total.entregas}
                </TableCell>
                <TableCell className="text-right font-bold text-slate-600">
                  {formatUSD(row.total.cotizado)}
                </TableCell>
                <TableCell className="text-right font-bold text-orange-500">
                  {formatUSD(row.total.ocPendiente)}
                </TableCell>
                <TableCell className="text-right font-black text-emerald-600">
                  {formatUSD(row.total.facturado)}
                </TableCell>
                <TableCell className="text-center font-bold text-blue-600 bg-blue-50/30">
                  {formatPct(row.total.ratio)}
                </TableCell>
                <TableCell className="text-center font-black text-emerald-700 bg-emerald-50/50">
                  {formatPct(row.total.cumplimiento)}
                </TableCell>
              </TableRow>

              {/* DETALLE DESPLEGABLE (SEMANAS CREADAS POR EL BACKEND) */}
              {expandedRows[row.id] &&
                row.semanas.map((semana, idx) => (
                  <TableRow
                    key={`${row.id}-sem-${idx}`}
                    className="bg-slate-50/60 hover:bg-slate-100/50 border-0"
                  >
                    <TableCell></TableCell>
                    <TableCell className="text-xs font-bold text-slate-500 pl-6 flex items-center gap-2 whitespace-nowrap">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{" "}
                      {semana.label}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-600">
                      {semana.visitas}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-600">
                      {semana.entregas}
                    </TableCell>
                    <TableCell className="text-right text-sm text-slate-500">
                      {formatUSD(semana.cotizado)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-orange-400/80">
                      {formatUSD(semana.ocPendiente)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-emerald-600/80">
                      {formatUSD(semana.facturado)}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium text-slate-500">
                      {formatPct(semana.ratio)}
                    </TableCell>
                    <TableCell className="text-center text-sm font-bold text-slate-500">
                      {formatPct(semana.cumplimiento)}
                    </TableCell>
                  </TableRow>
                ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
