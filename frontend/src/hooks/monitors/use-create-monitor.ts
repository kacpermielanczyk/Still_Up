import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createMonitor,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useCreateMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMonitor,

    onSuccess: async (monitor) => {
      queryClient.setQueryData(
        queryKeys.monitors.detail(
          monitor.id,
        ),
        monitor,
      );

      await queryClient.invalidateQueries({
        queryKey:
          queryKeys.monitors.all,
        exact: true,
      });
    },
  });
}
