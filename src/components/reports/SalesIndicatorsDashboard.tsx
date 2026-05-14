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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Briefcase, DollarSign } from "lucide-react";

// Asumiendo que esta es la respuesta de tu TanStack Query
const mockData = {
  weekLabels: [
    "01/02 - 08/02",
    "09/02 - 15/02",
    "16/02 - 22/02",
    "23/02 - 01/03",
  ],
  data: [
    {
      id: 1,
      userName: "Carlo Febres",
      totalMesVisitas: 18,
      totalMesMonto: 116657.77,
      weeks: [
        { label: "01/02 - 08/02", visitas: 5, montoCotizado: 20000.0 },
        { label: "09/02 - 15/02", visitas: 3, montoCotizado: 15000.5 },
        { label: "16/02 - 22/02", visitas: 8, montoCotizado: 60000.0 },
        { label: "23/02 - 01/03", visitas: 2, montoCotizado: 21657.27 },
      ],
    },
    {
      id: 2,
      userName: "Kevin Sigueñas",
      totalMesVisitas: 23,
      totalMesMonto: 79842.84,
      weeks: [
        { label: "01/02 - 08/02", visitas: 6, montoCotizado: 35000.0 },
        { label: "09/02 - 15/02", visitas: 7, montoCotizado: 20000.84 },
        { label: "16/02 - 22/02", visitas: 5, montoCotizado: 14000.0 },
        { label: "23/02 - 01/03", visitas: 5, montoCotizado: 10842.0 },
      ],
    },
    {
      id: 3,
      userName: "Cristian Velasque",
      totalMesVisitas: 11,
      totalMesMonto: 46386.1,
      weeks: [
        { label: "01/02 - 08/02", visitas: 4, montoCotizado: 10000.0 },
        { label: "09/02 - 15/02", visitas: 2, montoCotizado: 5000.0 },
        { label: "16/02 - 22/02", visitas: 2, montoCotizado: 16386.1 },
        { label: "23/02 - 01/03", visitas: 3, montoCotizado: 15000.0 },
      ],
    },
  ],
};

// Formateador de moneda profesional
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "USD", // Usando USD según tu Excel
  }).format(amount);
};

export default function SalesIndicatorsDashboard() {
  // Estado para manejar qué filas están expandidas
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-800">
          Cuadro de Indicadores
        </CardTitle>
        <CardDescription>
          Resumen de Visitas y Cotizaciones por Asesor (Febrero 2026)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="font-semibold text-slate-700">
                  Asesor de Ventas
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Visitas del Mes
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Monto Cotizado (Mes)
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-700">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.data.map((user) => (
                <React.Fragment key={user.id}>
                  {/* Fila Principal (Resumen del Mes) */}
                  <TableRow
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleRow(user.id)}
                  >
                    <TableCell>
                      {expandedRows[user.id] ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {user.userName}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Briefcase className="h-4 w-4 text-slate-400" />
                        <span className="font-semibold">
                          {user.totalMesVisitas}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(user.totalMesMonto)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.totalMesMonto > 50000 ? (
                        <Badge
                          variant="default"
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          Alto Rendimiento
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Regular</Badge>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Fila Desplegable (Detalle por Semanas) */}
                  {expandedRows[user.id] && (
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableCell colSpan={5} className="p-0">
                        <div className="p-4 pl-14 animate-in slide-in-from-top-2 duration-200">
                          <h4 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                            Desglose Semanal - {user.userName}
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">
                                  Rango de Fecha
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  Visitas
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  Cotizado
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {user.weeks.map((week, idx) => (
                                <TableRow key={idx} className="bg-white">
                                  <TableCell className="text-sm font-medium text-slate-700">
                                    {week.label}
                                  </TableCell>
                                  <TableCell className="text-sm text-right">
                                    {week.visitas}
                                  </TableCell>
                                  <TableCell className="text-sm text-right text-emerald-600 font-medium">
                                    {formatCurrency(week.montoCotizado)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
