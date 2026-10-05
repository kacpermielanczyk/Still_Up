import { ResponseTimeChart } from "@/components/monitors";
import { Tile } from "@/components/tiles";
import type { Monitor, MonitorCheck } from "@/types";
import { formatDateTime, formatMilliseconds } from "@/utils/formatters";

type MonitorPerformanceProps = {
  monitor: Monitor;
  checks: MonitorCheck[];
};

export default function MonitorPerformance({ monitor, checks }: MonitorPerformanceProps) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
      <Tile
        title="Response time"
        subtitle="Latest response measurements recorded by the worker."
      >
        <ResponseTimeChart checks={checks} />
      </Tile>

      <Tile
        title="Current state"
        subtitle="The latest values stored for this monitor."
      >
        <div className="space-y-4">
          <StateRow label="Last HTTP status" value={monitor.last_status_code ?? "—"} />
          <StateRow
            label="Last response"
            value={formatMilliseconds(monitor.last_response_time_ms)}
          />
          <StateRow label="Last checked" value={formatDateTime(monitor.last_checked_at)} />
          <StateRow
            label="Next check"
            value={monitor.enabled ? formatDateTime(monitor.next_check_at) : "Paused"}
          />

          <div className="grid grid-cols-2 gap-3 pt-1">
            <StreakCard
              label="Success streak"
              value={monitor.consecutive_successes}
              className="bg-success/10 text-success"
            />
            <StreakCard
              label="Failure streak"
              value={monitor.consecutive_failures}
              className="bg-danger/10 text-danger"
            />
          </div>
        </div>
      </Tile>
    </section>
  );
}

function StateRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0">
      <span className="text-sm font-medium text-text-muted">{label}</span>
      <strong className="text-right text-sm text-foreground">{value}</strong>
    </div>
  );
}

function StreakCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={`rounded-2xl p-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
