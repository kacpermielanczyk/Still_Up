import { Activity, Gauge, HeartPulse, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DashboardHero,
  NeedsAttentionTile,
  RecentMonitorsTile,
  SystemHealthTile,
} from "@/components/dashboard";
import { CreateMonitorModal } from "@/components/modals";
import { StatTile } from "@/components/tiles";
import { useAuthContext } from "@/contexts";
import { useHealth, useMonitors } from "@/hooks";
import type { Monitor } from "@/types";
import { formatMilliseconds } from "@/utils/formatters";

const EMPTY_MONITORS: Monitor[] = [];

export default function DashboardPage() {
  const { user } = useAuthContext();
  const healthQuery = useHealth();
  const monitorsQuery = useMonitors();
  const [createOpen, setCreateOpen] = useState(false);

  const monitors = monitorsQuery.data ?? EMPTY_MONITORS;

  const summary = useMemo(() => {
    const active = monitors.filter((monitor) => monitor.enabled);
    const responseTimes = active
      .map((monitor) => monitor.last_response_time_ms)
      .filter((value): value is number => value !== null);

    return {
      active: active.length,
      up: active.filter((monitor) => monitor.status === "up").length,
      issues: active.filter(
        (monitor) => monitor.status === "down" || monitor.status === "degraded",
      ).length,
      averageResponse:
        responseTimes.length === 0
          ? null
          : Math.round(
              responseTimes.reduce((total, value) => total + value, 0) /
                responseTimes.length,
            ),
    };
  }, [monitors]);

  const attention = monitors
    .filter(
      (monitor) =>
        monitor.enabled &&
        (monitor.status === "down" || monitor.status === "degraded"),
    )
    .slice(0, 4);

  const recent = monitors.slice(0, 5);

  return (
    <>
      <div className="mx-auto flex w-full max-w-375 flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-5 xl:grid-cols-[1.15fr_2fr]">
          <DashboardHero
            email={user?.email}
            onCreate={() => setCreateOpen(true)}
          />

          <div className="grid grid-cols-2 gap-4">
            <StatTile
              label="Monitors"
              value={monitorsQuery.isPending ? "—" : monitors.length}
              helper={`${summary.active} active`}
              icon={Activity}
              tone="primary"
            />

            <StatTile
              label="Operational"
              value={monitorsQuery.isPending ? "—" : summary.up}
              helper="Active monitors currently up"
              icon={HeartPulse}
              tone="success"
            />

            <StatTile
              label="Issues"
              value={monitorsQuery.isPending ? "—" : summary.issues}
              helper="Down or degraded"
              icon={TriangleAlert}
              tone={summary.issues > 0 ? "warning" : "default"}
            />

            <StatTile
              label="Avg. response"
              value={
                monitorsQuery.isPending
                  ? "—"
                  : formatMilliseconds(summary.averageResponse)
              }
              helper="Latest active measurements"
              icon={Gauge}
            />
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.45fr_0.8fr]">
          <NeedsAttentionTile monitors={attention} />
          <SystemHealthTile
            health={healthQuery.data}
            isPending={healthQuery.isPending}
            isError={healthQuery.isError}
          />
        </section>

        <RecentMonitorsTile monitors={recent} />
      </div>

      <CreateMonitorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </>
  );
}
