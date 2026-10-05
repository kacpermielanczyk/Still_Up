import type { MonitorStatsPeriod } from "./common";

export interface MonitorStats {
  period: MonitorStatsPeriod;
  uptime_percentage: number;
  average_response_time_ms: number | null;
  min_response_time_ms: number | null;
  max_response_time_ms: number | null;
  total_checks: number;
  successful_checks: number;
  failed_checks: number;
  total_incidents: number;
}

export interface MonitorStatsQuery {
  period?: MonitorStatsPeriod;
}
