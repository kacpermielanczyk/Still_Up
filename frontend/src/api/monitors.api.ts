import { MonitorStatsPeriod } from "@/types/common";
import { apiFetch } from "./client";

import type {
  Incident,
  Monitor,
  MonitorCheck,
  MonitorCreateRequest,
  MonitorStats,
  MonitorUpdateRequest,
} from "@/types";

export function getMonitors(signal?: AbortSignal) {
  return apiFetch<Monitor[]>("/monitors", {
    signal,
  });
}

export function getMonitor(monitorId: number, signal?: AbortSignal) {
  return apiFetch<Monitor>(`/monitors/${monitorId}`, {
    signal,
  });
}

export function createMonitor(payload: MonitorCreateRequest) {
  return apiFetch<Monitor>("/monitors", {
    method: "POST",
    body: payload,
  });
}

export function updateMonitor(
  monitorId: number,
  payload: MonitorUpdateRequest,
) {
  return apiFetch<Monitor>(`/monitors/${monitorId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteMonitor(monitorId: number) {
  return apiFetch<null>(`/monitors/${monitorId}`, {
    method: "DELETE",
  });
}

export function checkMonitorNow(monitorId: number) {
  return apiFetch<MonitorCheck>(`/monitors/${monitorId}/check`, {
    method: "POST",
  });
}

export function getMonitorChecks(
  monitorId: number,
  limit = 50,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  return apiFetch<MonitorCheck[]>(`/monitors/${monitorId}/checks?${params}`, {
    signal,
  });
}

export function getMonitorIncidents(
  monitorId: number,
  limit = 20,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    limit: String(limit),
  });

  return apiFetch<Incident[]>(`/monitors/${monitorId}/incidents?${params}`, {
    signal,
  });
}

export function getMonitorStats(
  monitorId: number,
  period: MonitorStatsPeriod = "24h",
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    period,
  });

  return apiFetch<MonitorStats>(`/monitors/${monitorId}/stats?${params}`, {
    signal,
  });
}
