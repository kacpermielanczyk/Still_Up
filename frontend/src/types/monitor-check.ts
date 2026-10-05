import type { CheckStatus } from "./common";

export interface MonitorCheck {
  id: number;

  status: CheckStatus;

  status_code: number | null;
  response_time_ms: number | null;

  error_type: string | null;
  error_message: string | null;

  checked_at: string;
}

export interface MonitorChecksQuery {
  limit?: number;
}
