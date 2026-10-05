import { Tile } from "@/components/tiles";
import type { MonitorStats } from "@/types";
import { formatMilliseconds } from "@/utils/formatters";

import PeriodSelector from "./PeriodSelector";
import { MonitorStatsPeriod } from "@/types/common";

type MonitorStatisticsProps = {
  stats?: MonitorStats;
  period: MonitorStatsPeriod;
  onPeriodChange: (period: MonitorStatsPeriod) => void;
  isLoading?: boolean;
};

export default function MonitorStatistics({
  stats,
  period,
  onPeriodChange,
  isLoading = false,
}: MonitorStatisticsProps) {
  const values = [
    [
      "Minimum response",
      formatMilliseconds(stats?.min_response_time_ms ?? null),
    ],
    [
      "Average response",
      formatMilliseconds(stats?.average_response_time_ms ?? null),
    ],
    [
      "Maximum response",
      formatMilliseconds(stats?.max_response_time_ms ?? null),
    ],
    ["Total checks", stats?.total_checks ?? "—"],
    ["Successful", stats?.successful_checks ?? "—"],
    ["Failed", stats?.failed_checks ?? "—"],
  ] as const;

  return (
    <Tile
      title="Statistics"
      subtitle={`Aggregated values for the last ${period}.`}
      action={<PeriodSelector value={period} onChange={onPeriodChange} />}
    >
      {isLoading && !stats ? (
        <div className="py-12 text-center text-sm font-semibold text-text-muted">
          Loading statistics...
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {values.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-input/50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {label}
              </p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}
    </Tile>
  );
}
