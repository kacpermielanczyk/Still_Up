import {
  useQuery,
} from "@tanstack/react-query";

import {
  getCurrentUser,
} from "@/api/auth.api";
import {
  isApiError,
} from "@/api/errors";
import {
  queryKeys,
} from "@/api/query-keys";

import type {
  User,
} from "@/types";


export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth.me,

    queryFn: async ({ signal }) => {
      try {
        return await getCurrentUser(
          signal,
        );
      } catch (error) {
        if (
          isApiError(error)
          && error.status === 401
        ) {
          return null;
        }

        throw error;
      }
    },

    staleTime: 60_000,
    retry: false,
  });
}
