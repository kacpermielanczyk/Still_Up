import type { IncidentStatus } from "./common";

export interface Incident {
  id: number;

  status: IncidentStatus;
  cause: string | null;

  started_at: string;
  resolved_at: string | null;
}

export interface IncidentsQuery {
  limit?: number;
}
