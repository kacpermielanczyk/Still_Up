import {
  ArrowLeft,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";

import { MonitorStatusBadge } from "@/components/monitors";
import type { Monitor } from "@/types";

import MonitorActionButton from "./MonitorActionButton";

type MonitorHeaderProps = {
  monitor: Monitor;
  checking: boolean;
  updating: boolean;
  onCheckNow: () => void;
  onToggleEnabled: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MonitorHeader({
  monitor,
  checking,
  updating,
  onCheckNow,
  onToggleEnabled,
  onEdit,
  onDelete,
}: MonitorHeaderProps) {
  return (
    <header>
      <Link
        to="/monitors"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Monitors
      </Link>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {monitor.name}
            </h1>

            <MonitorStatusBadge status={monitor.status} />

            {!monitor.enabled && (
              <span className="rounded-full border border-unknown/20 bg-unknown/10 px-3 py-1.5 text-sm font-semibold text-unknown">
                Paused
              </span>
            )}
          </div>

          <div className="mt-2">
            <Link
              to={monitor.url}
              className="break-all text-sm font-semibold text-text-muted underline hover:text-primary transition-all"
            >
              {monitor.url}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
          <MonitorActionButton
            text="Check now"
            icon={RefreshCw}
            tone="primary"
            loading={checking}
            disabled={updating}
            onClick={onCheckNow}
          />

          <MonitorActionButton
            text={monitor.enabled ? "Pause" : "Resume"}
            icon={monitor.enabled ? Pause : Play}
            loading={updating}
            disabled={checking}
            onClick={onToggleEnabled}
          />

          <MonitorActionButton text="Edit" icon={Pencil} onClick={onEdit} />
          <MonitorActionButton
            text="Delete"
            icon={Trash2}
            tone="danger"
            onClick={onDelete}
          />
        </div>
      </div>
    </header>
  );
}
