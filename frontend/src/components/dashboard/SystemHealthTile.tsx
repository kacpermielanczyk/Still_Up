import { Database, Server } from "lucide-react";

import { Tile } from "@/components/tiles";
import type { HealthResponse } from "@/types";

type SystemHealthTileProps = {
  health?: HealthResponse;
  isPending: boolean;
  isError: boolean;
};

export default function SystemHealthTile({
  health,
  isPending,
  isError,
}: SystemHealthTileProps) {
  const healthy = !isPending && !isError && health?.status === "ok" && health.database === "ok";

  return (
    <Tile
      title="Still Up backend"
      subtitle="FastAPI, PostgreSQL and the current migration state."
      variant={healthy ? "accent" : isError ? "danger" : "muted"}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-3">
          <span className={`flex size-11 items-center justify-center rounded-2xl ${healthy ? "bg-success/10 text-success" : isError ? "bg-danger/10 text-danger" : "bg-input text-text-muted"}`}>
            <Server className="size-5" />
          </span>

          <div>
            <p className="font-semibold text-foreground">
              {isPending ? "Checking API..." : healthy ? "API operational" : "API unavailable"}
            </p>
            <p className="mt-1 text-sm font-medium text-text-muted">Python service health</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-3">
          <span className={`flex size-11 items-center justify-center rounded-2xl ${health?.database === "ok" ? "bg-success/10 text-success" : "bg-input text-text-muted"}`}>
            <Database className="size-5" />
          </span>

          <div className="min-w-0">
            <p className="font-semibold text-foreground">Database {health?.database ?? "unknown"}</p>
            <p className="mt-1 truncate font-mono text-xs font-medium text-text-muted">
              Migration: {health?.migration ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </Tile>
  );
}
