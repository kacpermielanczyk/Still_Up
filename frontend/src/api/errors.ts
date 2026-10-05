export type FastApiValidationError = {
  type?: string;
  loc?: Array<string | number>;
  msg?: string;
  input?: unknown;
};

export type ApiErrorBody = {
  detail?:
    | string
    | FastApiValidationError[]
    | Record<string, unknown>;
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(
    message: string,
    status: number,
    body: ApiErrorBody | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isApiError(
  error: unknown,
): error is ApiError {
  return error instanceof ApiError;
}
