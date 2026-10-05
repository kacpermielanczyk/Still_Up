import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMonitorChecks,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useMonitorChecks(
  monitorId: number,
  limit = 50,
) {
  return useQuery({
    queryKey:
      queryKeys.monitors.checks(
        monitorId,
        limit,
      ),

    queryFn: ({ signal }) =>
      getMonitorChecks(
        monitorId,
        limit,
        signal,
      ),

    enabled:
      Number.isInteger(monitorId)
      && monitorId > 0,

    refetchInterval: 10_000,
  });
}
