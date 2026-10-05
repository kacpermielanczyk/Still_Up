import { Gauge, HeartPulse, ServerCrash, TriangleAlert } from "lucide-react";

import { StatTile } from "@/components/tiles";
import type { MonitorCheck, MonitorStats } from "@/types";
import { formatMilliseconds } from "@/utils/formatters";
import { MonitorStatsPeriod } from "@/types/common";

type MonitorSummaryProps = {
  stats?: MonitorStats;
  period: MonitorStatsPeriod;
  checks: MonitorCheck[];
  incidentCount: number;
};

export default function MonitorSummary({
  stats,
  period,
  checks,
  incidentCount,
}: MonitorSummaryProps) {
  const successfulChecks = checks.filter(
    (check) => check.status === "success",
  ).length;
  const failedChecks = checks.length - successfulChecks;
  const displayedSuccessfulChecks =
    stats?.successful_checks ?? successfulChecks;
  const displayedFailedChecks = stats?.failed_checks ?? failedChecks;
  const displayedTotalChecks = stats?.total_checks ?? checks.length;
  const displayedIncidents = stats?.total_incidents ?? incidentCount;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label={`Uptime ${period}`}
        value={stats ? `${stats.uptime_percentage.toFixed(2)}%` : "—"}
        helper={`${displayedSuccessfulChecks} successful checks`}
        icon={HeartPulse}
        tone="success"
      />

      <StatTile
        label="Average response"
        value={formatMilliseconds(stats?.average_response_time_ms ?? null)}
        helper="For selected period"
        icon={Gauge}
        tone="primary"
      />

      <StatTile
        label="Failed checks"
        value={displayedFailedChecks}
        helper={`${displayedTotalChecks} total`}
        icon={TriangleAlert}
        tone={displayedFailedChecks > 0 ? "warning" : "default"}
      />

      <StatTile
        label="Incidents"
        value={displayedIncidents}
        helper={`Within ${period}`}
        icon={ServerCrash}
        tone={displayedIncidents > 0 ? "danger" : "default"}
      />
    </div>
  );
}
