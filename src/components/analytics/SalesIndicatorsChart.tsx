"use client";

import ReactECharts from "echarts-for-react";
import { analyticsMockData } from "./mock-analytics.data";

export function SalesIndicatorsChart({
  departmentId,
}: {
  departmentId: number;
}) {
  // ⏳ FUTURO HOOK IGUAL AL DE LA TABLA
  const data = analyticsMockData;

  // Extraemos datos directamente de la estructura de tu mock
  const xAxisData = data.map((d) => d.asesor);
  const seriesCotizado = data.map((d) => d.total.cotizado);
  const seriesOCPendiente = data.map((d) => d.total.ocPendiente);
  const seriesFacturado = data.map((d) => d.total.facturado);

  const option = {
    color: ["#2d1c42", "#c88b00", "#10b981"], // Violet Night, Dorado (OC Pendiente), Emerald-500
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    legend: {
      data: ["Monto Cotizado", "OC Pendiente", "Monto Facturado"],
      bottom: 0,
      icon: "roundRect",
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "12%",
      top: "8%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: xAxisData,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: { color: "#475569", fontWeight: "bold", margin: 12 },
      },
    ],
    yAxis: [
      {
        type: "value",
        splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
        axisLabel: {
          color: "#94a3b8",
          formatter: (value: number) => `$${value / 1000}k`,
        },
      },
    ],
    series: [
      {
        name: "Monto Cotizado",
        type: "bar",
        barGap: "15%",
        data: seriesCotizado,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "OC Pendiente",
        type: "bar",
        data: seriesOCPendiente,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "Monto Facturado",
        type: "bar",
        data: seriesFacturado,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mt-6">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">
        Comparativa de Gestión Comercial
      </h3>
      <ReactECharts
        option={option}
        style={{ height: "420px", width: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
}
