import {
  QueryClient,
} from "@tanstack/react-query";

import {
  ApiError,
} from "./errors";

function shouldRetry(
  failureCount: number,
  error: unknown,
) {
  if (
    error instanceof ApiError
    && error.status >= 400
    && error.status < 500
  ) {
    return false;
  }

  return failureCount < 2;
}

export const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: shouldRetry,
        refetchOnWindowFocus: true,
      },

      mutations: {
        retry: false,
      },
    },
  });
