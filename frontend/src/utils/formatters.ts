export function formatMilliseconds(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `${Math.round(value)} ms`;
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatRelativeTime(value: string | null) {
  if (!value) {
    return "never";
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs)) {
    return value;
  }

  if (diffMs < 0) {
    return formatDateTime(value);
  }

  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 10) {
    return "just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return formatDateTime(value);
}

export function formatDurationBetween(
  startedAt: string,
  resolvedAt: string | null,
) {
  const start = new Date(startedAt);
  const end = resolvedAt ? new Date(resolvedAt) : new Date();
  const diff = end.getTime() - start.getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return "—";
  }

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}
