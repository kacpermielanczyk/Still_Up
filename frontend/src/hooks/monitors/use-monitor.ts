import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMonitor,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useMonitor(
  monitorId: number,
) {
  return useQuery({
    queryKey:
      queryKeys.monitors.detail(
        monitorId,
      ),

    queryFn: ({ signal }) =>
      getMonitor(
        monitorId,
        signal,
      ),

    enabled:
      Number.isInteger(monitorId)
      && monitorId > 0,

    refetchInterval: 10_000,
  });
}
