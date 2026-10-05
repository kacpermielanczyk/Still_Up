import {
  apiFetch,
} from "./client";

import type {
  HealthResponse,
} from "@/types";


export function getHealth(
  signal?: AbortSignal,
) {
  return apiFetch<HealthResponse>(
    "/health",
    {
      signal,
    },
  );
}
