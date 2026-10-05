import { HeartPulse } from "lucide-react";
import { Link } from "react-router";

import { MonitorItem, MonitorStatusBadge } from "@/components/monitors";
import { Tile } from "@/components/tiles";
import type { Monitor } from "@/types";

type NeedsAttentionTileProps = {
  monitors: Monitor[];
};

export default function NeedsAttentionTile({
  monitors,
}: NeedsAttentionTileProps) {
  return (
    <Tile
      title="Needs attention"
      subtitle="Resources that are currently down or degraded."
      action={
        <Link
          to="/monitors"
          className="text-sm font-semibold text-primary hover:underline"
        >
          All monitors
        </Link>
      }
    >
      {monitors.length === 0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-success/10 text-success">
            <HeartPulse className="size-5" />
          </span>
          <p className="mt-3 font-semibold text-foreground">
            Everything looks healthy
          </p>
          <p className="mt-1 text-sm font-medium text-text-muted">
            No monitor requires your attention right now.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {monitors.map((monitor) => (
            <Link key={monitor.id} to={`/monitors/${monitor.id}`}>
              <MonitorItem
                name={monitor.name}
                url={monitor.url}
                status={monitor.status}
              />
            </Link>
          ))}
        </div>
      )}
    </Tile>
  );
}
