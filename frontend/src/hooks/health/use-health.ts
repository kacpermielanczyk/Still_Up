import {
  useQuery,
} from "@tanstack/react-query";

import {
  getHealth,
} from "@/api/health.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,

    queryFn: ({ signal }) =>
      getHealth(signal),

    staleTime: 10_000,
    refetchInterval: 30_000,
    retry: 1,
  });
}
