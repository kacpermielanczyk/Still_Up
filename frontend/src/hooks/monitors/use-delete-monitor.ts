import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteMonitor,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useDeleteMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      monitorId: number,
    ) =>
      deleteMonitor(
        monitorId,
      ),

    onSuccess: async (
      _,
      monitorId,
    ) => {
      queryClient.removeQueries({
        queryKey:
          queryKeys.monitors.detail(
            monitorId,
          ),
      });

      await queryClient.invalidateQueries({
        queryKey:
          queryKeys.monitors.all,
        exact: true,
      });
    },
  });
}
