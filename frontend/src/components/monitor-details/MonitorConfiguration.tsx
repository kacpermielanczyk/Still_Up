import { Tile } from "@/components/tiles";
import type { Monitor } from "@/types";

type MonitorConfigurationProps = {
  monitor: Monitor;
};

export default function MonitorConfiguration({ monitor }: MonitorConfigurationProps) {
  const values = [
    ["Resource type", monitor.resource_type.toUpperCase()],
    ["HTTP method", monitor.method],
    ["Interval", `${monitor.interval_seconds}s`],
    ["Timeout", `${monitor.timeout_seconds}s`],
    ["Expected status", monitor.expected_status_code ?? "200–399"],
    ["Follow redirects", monitor.follow_redirects ? "Yes" : "No"],
    ["Failure threshold", monitor.failure_threshold],
    ["Recovery threshold", monitor.recovery_threshold],
  ] as const;

  return (
    <Tile title="Configuration" subtitle="How Still Up checks this resource.">
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {values.map(([label, value]) => (
          <div key={label} className="border-b border-border pb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {label}
            </p>
            <p className="mt-1 font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </Tile>
  );
}
