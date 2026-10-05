import { useQuery } from "@tanstack/react-query";

import { getMonitorStats } from "@/api/monitors.api";
import { queryKeys } from "@/api/query-keys";
import { MonitorStatsPeriod } from "@/types/common";

export function useMonitorStats(
  monitorId: number,
  period: MonitorStatsPeriod = "24h",
) {
  return useQuery({
    queryKey: queryKeys.monitors.stats(monitorId, period),

    queryFn: ({ signal }) => getMonitorStats(monitorId, period, signal),

    enabled: Number.isInteger(monitorId) && monitorId > 0,

    refetchInterval: 30_000,
  });
}
