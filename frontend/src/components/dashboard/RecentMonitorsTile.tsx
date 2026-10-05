import { Link } from "react-router";

import { Tile } from "@/components/tiles";
import type { Monitor } from "@/types";
import { formatMilliseconds } from "@/utils/formatters";

type RecentMonitorsTileProps = {
  monitors: Monitor[];
};

const statusDotClass = {
  up: "bg-success",
  down: "bg-danger",
  degraded: "bg-warning",
  unknown: "bg-unknown",
};

export default function RecentMonitorsTile({
  monitors,
}: RecentMonitorsTileProps) {
  return (
    <Tile
      title="Recent monitors"
      subtitle="Recently created resources and their latest response time."
    >
      {monitors.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-semibold text-foreground">No monitors yet</p>
          <p className="mt-1 text-sm font-medium text-text-muted">
            Create your first website or API monitor.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {monitors.map((monitor) => (
            <Link
              key={monitor.id}
              to={`/monitors/${monitor.id}`}
              className="
              rounded-2xl border border-border bg-input/50 p-4 transition-all hover:-translate-y-0.5 hover:bg-input-hover
              hover:border-primary/40
              "
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-semibold text-foreground">
                  {monitor.name}
                </p>
                <div className="flex relative justify-center items-center">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${statusDotClass[monitor.status]}`}
                  />
                  <span
                    className={`size-2.5 absolute rounded-full animate-ping ${monitor.status === "up" && statusDotClass[monitor.status]}`}
                  />
                </div>
              </div>

              <p className="mt-2 truncate text-xs font-semibold uppercase tracking-wide text-text-muted">
                {monitor.resource_type}
              </p>

              <p className="mt-5 text-lg font-semibold text-foreground">
                {formatMilliseconds(monitor.last_response_time_ms)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Tile>
  );
}
