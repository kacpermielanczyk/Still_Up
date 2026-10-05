import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  logout,
} from "@/api/auth.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.setQueryData(
        queryKeys.auth.me,
        null,
      );

      queryClient.removeQueries({
        queryKey: queryKeys.monitors.all,
      });
    },
  });
}
