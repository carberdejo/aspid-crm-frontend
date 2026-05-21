"use client";

import ReactECharts from "echarts-for-react";
import { analyticsMockData } from "./mock-analytics.data";

export function SalesIndicatorsChart() {
  // 1. Extraemos los nombres de los asesores para el Eje X
  const asesores = analyticsMockData.map((data) => data.asesor);

  // 2. Mapeamos las métricas principales para las barras
  const cotizado = analyticsMockData.map((data) => data.total.cotizado);
  const ocPendiente = analyticsMockData.map((data) => data.total.ocPendiente);
  const facturado = analyticsMockData.map((data) => data.total.facturado);

  // 3. Configuración de ECharts nivel Enterprise
  const option = {
    // Paleta de colores: Slate-800, Blue-500, Emerald-500
    color: ["#1e293b", "#3b82f6", "#10b981"],

    // Tooltip interactivo al pasar el mouse
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e2e8f0",
      textStyle: { color: "#334155" },
      valueFormatter: (value: number) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },

    // Leyenda interactiva (puedes hacer clic para ocultar/mostrar barras)
    legend: {
      data: ["Monto Cotizado", "OC Pendiente", "Facturado"],
      bottom: 0,
      icon: "roundRect",
      textStyle: { color: "#64748b", fontWeight: 600 },
    },

    // Márgenes internos del gráfico
    grid: {
      left: "2%",
      right: "2%",
      bottom: "12%",
      top: "8%",
      containLabel: true,
    },

    // Configuración del Eje X (Asesores)
    xAxis: [
      {
        type: "category",
        data: asesores,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#e2e8f0" } },
        axisLabel: {
          color: "#475569",
          fontWeight: "bold",
          margin: 12,
        },
      },
    ],

    // Configuración del Eje Y (Montos)
    yAxis: [
      {
        type: "value",
        splitLine: {
          lineStyle: { type: "dashed", color: "#f1f5f9" },
        },
        axisLabel: {
          color: "#94a3b8",
          // Formateamos a miles (k) para no saturar la pantalla de ceros
          formatter: (value: number) => `$${value / 1000}k`,
        },
      },
    ],

    // Las series de datos (Las barras)
    series: [
      {
        name: "Monto Cotizado",
        type: "bar",
        barGap: "15%", // Espacio entre barras del mismo asesor
        data: cotizado,
        // Bordes redondeados en la parte superior para un look moderno
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "OC Pendiente",
        type: "bar",
        data: ocPendiente,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "Facturado",
        type: "bar",
        data: facturado,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mt-6">
      <div className="mb-6 border-b border-slate-50 pb-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          Comparativa Comercial General
        </h3>
        <p className="text-xs font-medium text-slate-400 mt-1">
          Montos expresados en USD a tipo de cambio actual
        </p>
      </div>

      {/* El canvas mágico de ECharts */}
      <ReactECharts
        option={option}
        style={{ height: "420px", width: "100%" }}
        opts={{ renderer: "canvas" }} // Aseguramos el máximo rendimiento
      />
    </div>
  );
}
