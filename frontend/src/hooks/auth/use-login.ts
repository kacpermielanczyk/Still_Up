import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  login,
} from "@/api/auth.api";
import {
  queryKeys,
} from "@/api/query-keys";


export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      queryClient.setQueryData(
        queryKeys.auth.me,
        data.user,
      );

      queryClient.removeQueries({
        queryKey: queryKeys.monitors.all,
      });
    },
  });
}
