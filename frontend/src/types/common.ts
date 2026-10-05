export type ResourceType = "website" | "api";

export type MonitorStatus =
  | "unknown"
  | "up"
  | "down"
  | "degraded";

export type CheckStatus =
  | "success"
  | "failure";

export type IncidentStatus =
  | "open"
  | "resolved";

export type HttpMethod =
  | "GET"
  | "HEAD";

export type MonitorStatsPeriod =
  | "24h"
  | "7d"
  | "30d";
