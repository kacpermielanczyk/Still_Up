import { Clock3, Code2, Globe2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";

import type { Monitor } from "@/types";
import { formatMilliseconds, formatRelativeTime } from "@/utils/formatters";

import MonitorStatusBadge from "./MonitorStatusBadge";

type MonitorCardProps = {
  monitor: Monitor;
  onEdit: (monitor: Monitor) => void;
  onDelete: (monitor: Monitor) => void;
};

export default function MonitorCard({
  monitor,
  onEdit,
  onDelete,
}: MonitorCardProps) {
  const TypeIcon = monitor.resource_type === "api" ? Code2 : Globe2;

  return (
    <article className="group rounded-3xl border border-border bg-tile p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-input text-text-secondary">
            <TypeIcon className="size-5" />
          </span>

          <div className="min-w-0">
            <Link
              to={`/monitors/${monitor.id}`}
              className="block truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
            >
              {monitor.name}
            </Link>
            <p className="mt-1 truncate text-sm font-medium text-text-muted">
              {monitor.url}
            </p>
          </div>
        </div>

        <MonitorStatusBadge status={monitor.status} compact />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Response" value={formatMilliseconds(monitor.last_response_time_ms)} />
        <Metric label="HTTP" value={monitor.last_status_code ?? "—"} />
        <Metric label="Interval" value={`${monitor.interval_seconds}s`} />
        <Metric label="State" value={monitor.enabled ? "Enabled" : "Paused"} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-text-muted">
          <Clock3 className="size-4 shrink-0" />
          <span className="truncate">
            {monitor.last_checked_at
              ? `Checked ${formatRelativeTime(monitor.last_checked_at)}`
              : "Not checked yet"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(monitor)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-input-border bg-input px-3 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-input-hover hover:text-primary"
          >
            <Pencil className="size-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(monitor)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger transition-all hover:bg-danger/15"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}
