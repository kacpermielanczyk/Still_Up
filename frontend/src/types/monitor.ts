import type { HttpMethod, MonitorStatus, ResourceType } from "./common";

export interface Monitor {
  id: number;

  name: string;
  resource_type: ResourceType;

  url: string;
  method: HttpMethod;

  interval_seconds: number;
  timeout_seconds: number;

  expected_status_code: number | null;
  follow_redirects: boolean;

  enabled: boolean;
  status: MonitorStatus;

  failure_threshold: number;
  recovery_threshold: number;

  consecutive_failures: number;
  consecutive_successes: number;

  last_status_code: number | null;
  last_response_time_ms: number | null;

  last_checked_at: string | null;
  next_check_at: string | null;

  created_at: string;
  updated_at: string;
}

/**
 * Exact request shape accepted by POST /monitors.
 *
 * Fields with `?` have defaults on the backend and can be omitted.
 */
export interface MonitorCreateRequest {
  name: string;
  resource_type: ResourceType;
  url: string;

  method?: HttpMethod;

  interval_seconds?: number;
  timeout_seconds?: number;

  expected_status_code?: number | null;
  follow_redirects?: boolean;

  failure_threshold?: number;
  recovery_threshold?: number;
}

/**
 * Useful for a controlled React form.
 * All values exist in form state even though some are optional in the API.
 */
export interface MonitorCreateFormValues {
  name: string;
  resource_type: ResourceType;
  url: string;

  method: HttpMethod;

  interval_seconds: number;
  timeout_seconds: number;

  expected_status_code: number | null;
  follow_redirects: boolean;

  failure_threshold: number;
  recovery_threshold: number;
}

/**
 * PATCH /monitors/:id
 *
 * Every field is optional.
 * `expected_status_code` can explicitly be set to null.
 */
export interface MonitorUpdateRequest {
  name?: string;
  resource_type?: ResourceType;
  url?: string;
  method?: HttpMethod;

  interval_seconds?: number;
  timeout_seconds?: number;

  expected_status_code?: number | null;
  follow_redirects?: boolean;
  enabled?: boolean;

  failure_threshold?: number;
  recovery_threshold?: number;
}

/**
 * Convenient shape for an edit form populated from a Monitor.
 */
export interface MonitorEditFormValues {
  name: string;
  resource_type: ResourceType;
  url: string;

  method: HttpMethod;

  interval_seconds: number;
  timeout_seconds: number;

  expected_status_code: number | null;
  follow_redirects: boolean;
  enabled: boolean;

  failure_threshold: number;
  recovery_threshold: number;
}
