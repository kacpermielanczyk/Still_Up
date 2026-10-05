import {
  ApiError,
  type ApiErrorBody,
} from "./errors";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "Missing VITE_API_URL environment variable",
  );
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

function getErrorMessage(
  body: ApiErrorBody | null,
  status: number,
): string {
  if (!body) {
    return `Request failed with status ${status}`;
  }

  if (typeof body.detail === "string") {
    return body.detail;
  }

  if (
    Array.isArray(body.detail)
    && body.detail.length > 0
  ) {
    return body.detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(", ");
  }

  if (typeof body.message === "string") {
    return body.message;
  }

  return `Request failed with status ${status}`;
}

async function parseResponseBody(
  response: Response,
): Promise<unknown> {
  if (
    response.status === 204
    || response.headers.get("content-length") === "0"
  ) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (
    contentType.includes("application/json")
  ) {
    return response.json();
  }

  const text = await response.text();

  return text || null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(
    options.headers,
  );

  if (
    options.body !== undefined
    && !(options.body instanceof FormData)
    && !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  headers.set(
    "Accept",
    "application/json",
  );

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
      credentials: "include",
      body:
        options.body === undefined
          ? undefined
          : options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
    },
  );

  const body = await parseResponseBody(
    response,
  );

  if (!response.ok) {
    const errorBody =
      body !== null
      && typeof body === "object"
        ? body as ApiErrorBody
        : null;

    throw new ApiError(
      getErrorMessage(
        errorBody,
        response.status,
      ),
      response.status,
      errorBody,
    );
  }

  return body as T;
}
