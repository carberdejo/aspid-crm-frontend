export interface QuotesSummary {
  total: number;
  pending: number;
  approved: number;
  totalAmount: number;
}

export interface VisitMetricsQueryDto {
  userId?: number;
  startDate?: string;
  endDate?: string;
}

export interface MetricDetail {
  name: string;
  count: number;
}

export interface PeakDay {
  date: string | null;
  count: number;
}

export interface VisitStatsResponse {
  total: number;
  mostVisitedClient: MetricDetail;
  mostVisitedContact: MetricDetail;
  peakActivityDay: PeakDay;
}

//======================
// Común a todos los endpoints de métricas
//======================
export type MetricType = "number" | "currency" | "percent";

// Configuración de cada columna/métrica
export interface MetricConfig {
  key: string; // Ej: "cotizado", "horasTrabajadas"
  label: string; // Ej: "Monto Cotizado", "Horas"
  type: MetricType; // Para saber cómo formatearlo
  color?: string; // Color para el gráfico en ECharts
}

// Estructura universal de la fila (Sirve para asesores, ingenieros, proyectos, etc.)
export interface GenericRowData {
  id: number;
  entityName: string; // Nombre del Asesor o del Proyecto
  total: Record<string, number>; // Objeto dinámico { cotizado: 5000, visitas: 10 }
  details: Array<{ label: string } & Record<string, number>>; // Las semanas
}
