import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateMonitor,
} from "@/api/monitors.api";
import {
  queryKeys,
} from "@/api/query-keys";

import type {
  MonitorUpdateRequest,
} from "@/types";


type UpdateMonitorVariables = {
  monitorId: number;
  payload: MonitorUpdateRequest;
};


export function useUpdateMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      monitorId,
      payload,
    }: UpdateMonitorVariables) =>
      updateMonitor(
        monitorId,
        payload,
      ),

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
