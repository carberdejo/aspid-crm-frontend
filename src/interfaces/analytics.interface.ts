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
