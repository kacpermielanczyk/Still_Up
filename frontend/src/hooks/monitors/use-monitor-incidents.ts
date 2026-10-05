import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMonitorIncidents,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useMonitorIncidents(
  monitorId: number,
  limit = 20,
) {
  return useQuery({
    queryKey:
      queryKeys.monitors.incidents(
        monitorId,
        limit,
      ),

    queryFn: ({ signal }) =>
      getMonitorIncidents(
        monitorId,
        limit,
        signal,
      ),

    enabled:
      Number.isInteger(monitorId)
      && monitorId > 0,

    refetchInterval: 15_000,
  });
}
