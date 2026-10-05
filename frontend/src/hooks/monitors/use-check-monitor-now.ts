import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  checkMonitorNow,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useCheckMonitorNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      monitorId: number,
    ) =>
      checkMonitorNow(
        monitorId,
      ),

    onSuccess: async (
      _,
      monitorId,
    ) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            queryKeys.monitors.all,
          exact: true,
        }),

        queryClient.invalidateQueries({
          queryKey:
            queryKeys.monitors.detail(
              monitorId,
            ),
        }),
      ]);
    },
  });
}
