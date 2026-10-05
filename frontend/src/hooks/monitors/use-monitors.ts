import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMonitors,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useMonitors() {
  return useQuery({
    queryKey: queryKeys.monitors.all,

    queryFn: ({ signal }) =>
      getMonitors(signal),

    refetchInterval: 10_000,
  });
}
