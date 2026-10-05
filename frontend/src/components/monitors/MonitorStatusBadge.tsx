import { MonitorStatus } from "@/types/common";

type MonitorStatusBadgeProps = {
  status: MonitorStatus;
  compact?: boolean;
};

const styles: Record<MonitorStatus, string> = {
  up: "border-success/20 bg-success/10 text-success",
  down: "border-danger/20 bg-danger/10 text-danger",
  degraded: "border-warning/20 bg-warning/10 text-warning",
  unknown: "border-unknown/20 bg-unknown/10 text-unknown",
};

const labels: Record<MonitorStatus, string> = {
  up: "Up",
  down: "Down",
  degraded: "Degraded",
  unknown: "Unknown",
};

export default function MonitorStatusBadge({
  status,
  compact = false,
}: MonitorStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full border font-semibold
        ${styles[status]}
        ${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}
      `}
    >
      <span
        className="
          size-2 rounded-full bg-current relative after:absolute after:size-2 after:bg-current after:rounded-full
          after:animate-ping
      "
      />
      {labels[status]}
    </span>
  );
}
