"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SalesIndicatorsDashboard from "@/components/reports/SalesIndicatorsDashboard";

// Datos de ejemplo segmentados por semanas y usuarios
const mockDataByMonth = {
  mayo: [
    {
      id: 1,
      name: "CARLOS BERDEJO",
      s1: 3,
      s2: 4,
      s3: 2,
      s4: 3,
      cotizaciones: 25,
      facturado: 15400,
      meta: 20000,
    },
    {
      id: 2,
      name: "ANA MARTINEZ",
      s1: 4,
      s2: 5,
      s3: 3,
      s4: 3,
      cotizaciones: 30,
      facturado: 22100,
      meta: 20000,
    },
    {
      id: 3,
      name: "PEDRO SUAREZ",
      s1: 2,
      s2: 2,
      s3: 2,
      s4: 2,
      cotizaciones: 15,
      facturado: 8900,
      meta: 15000,
    },
  ],
  abril: [
    {
      id: 1,
      name: "CARLOS BERDEJO",
      s1: 5,
      s2: 5,
      s3: 4,
      s4: 6,
      cotizaciones: 40,
      facturado: 28000,
      meta: 20000,
    },
    // ... más datos
  ],
};

export default function DepartmentReportsPage() {
  // const [isClient, setIsClient] = useState(false);
  const [month, setMonth] = useState("mayo");
  // const [filterMetric, setFilterMetric] = useState("all");

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) return <div className="h-screen bg-slate-50/30" />;

  const currentData =
    mockDataByMonth[month as keyof typeof mockDataByMonth] || [];

  return (
    <div className="flex flex-col h-screen bg-slate-50/30 overflow-hidden">
      {/* SECCIÓN SUPERIOR: TABLA ANALÍTICA (50%) */}
      {/* <div className="h-1/2 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-primary uppercase tracking-tighter">
            Reporte Semanal{" "}
            <span className="text-secondary-text">/ {month} 2026</span>
          </h1>

          <div className="flex gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[150px] h-9 rounded-xl font-bold text-[10px] uppercase">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mayo">Mayo</SelectItem>
                <SelectItem value="abril">Abril</SelectItem>
                <SelectItem value="marzo">Marzo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="flex-1 overflow-hidden rounded-[2rem] border-slate-200 shadow-xl flex flex-col bg-white">
          <div className="overflow-auto scrollbar-thin">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="divide-x divide-slate-100">
                  <TableHead className="w-[220px] font-black text-primary uppercase text-[9px] sticky left-0 bg-slate-50">
                    Indicadores / Usuarios
                  </TableHead>
                  {currentData.map((u) => (
                    <TableHead
                      key={u.id}
                      className="text-center min-w-[140px] font-bold text-[10px] uppercase text-slate-500"
                    >
                      {u.name.split(" ")[0]} {u.name.split(" ")[1]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                <TableRow className="bg-slate-50/30">
                  <TableCell
                    colSpan={currentData.length + 1}
                    className="py-1 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Gestión Semanal (Visitas)
                  </TableCell>
                </TableRow>
                <TableRow className="divide-x divide-slate-100">
                  <TableCell className="text-[10px] font-bold text-slate-500 pl-6">
                    Semana 1
                  </TableCell>
                  {currentData.map((u) => (
                    <TableCell
                      key={u.id}
                      className="text-center text-xs font-medium"
                    >
                      {u.s1}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="divide-x divide-slate-100">
                  <TableCell className="text-[10px] font-bold text-slate-500 pl-6">
                    Semana 2
                  </TableCell>
                  {currentData.map((u) => (
                    <TableCell
                      key={u.id}
                      className="text-center text-xs font-medium"
                    >
                      {u.s2}
                    </TableCell>
                  ))}
                </TableRow>

                <TableRow className="bg-slate-50/30">
                  <TableCell
                    colSpan={currentData.length + 1}
                    className="py-1 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Ratios de Eficacia
                  </TableCell>
                </TableRow>
                <TableRow className="divide-x divide-slate-100">
                  <TableCell className="text-[10px] font-bold text-primary pl-6 uppercase">
                    Ratio Conversión
                  </TableCell>
                  {currentData.map((u) => {
                    const totalVisitas = u.s1 + u.s2 + u.s3 + u.s4;
                    const ratio = (
                      (u.cotizaciones / totalVisitas) *
                      10
                    ).toFixed(1); // Ejemplo de cálculo
                    return (
                      <TableCell
                        key={u.id}
                        className="text-center font-black text-blue-600"
                      >
                        {ratio}%
                      </TableCell>
                    );
                  })}
                </TableRow>
                <TableRow className="divide-x divide-slate-100 bg-secondary/5">
                  <TableCell className="text-[10px] font-black text-secondary-text pl-6 uppercase">
                    Cumplimiento Meta
                  </TableCell>
                  {currentData.map((u) => {
                    const cumplimiento = ((u.facturado / u.meta) * 100).toFixed(
                      0,
                    );
                    return (
                      <TableCell
                        key={u.id}
                        className={`text-center font-black ${Number(cumplimiento) >= 100 ? "text-emerald-600" : "text-rose-500"}`}
                      >
                        {cumplimiento}%
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div> */}
      <SalesIndicatorsDashboard />

      {/* SECCIÓN INFERIOR: GRÁFICO (50%) */}
      <div className="h-1/2 p-4 flex flex-col">
        <Card className="flex-1 rounded-[2rem] border-slate-200 shadow-sm flex flex-col overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tendencia de Facturación vs Meta
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-6 pr-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.split(" ")[0]}
                />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "16px", border: "none" }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="facturado"
                  name="Venta Real"
                  fill="#2d1c42"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  name="Meta Sugerida"
                  stroke="#c88b00"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
