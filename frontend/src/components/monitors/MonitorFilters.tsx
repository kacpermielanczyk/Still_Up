import { Search } from "lucide-react";

import { Tile } from "@/components/tiles";
import { MonitorStatus, ResourceType } from "@/types/common";

export type MonitorStatusFilter = "all" | MonitorStatus | "paused";
export type MonitorTypeFilter = "all" | ResourceType;

type MonitorFiltersProps = {
  search: string;
  status: MonitorStatusFilter;
  resourceType: MonitorTypeFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: MonitorStatusFilter) => void;
  onTypeChange: (value: MonitorTypeFilter) => void;
};

const statusFilters: Array<{ label: string; value: MonitorStatusFilter }> = [
  { label: "All", value: "all" },
  { label: "Up", value: "up" },
  { label: "Degraded", value: "degraded" },
  { label: "Down", value: "down" },
  { label: "Paused", value: "paused" },
];

export default function MonitorFilters({
  search,
  status,
  resourceType,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: MonitorFiltersProps) {
  return (
    <Tile padding="sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by name or URL..."
            className="w-full rounded-xl border border-input-border bg-input py-2.5 pl-10 pr-3 text-sm font-medium text-foreground outline-none transition-all placeholder:text-input-placeholder focus:border-primary focus:ring-4 focus:ring-primary-ring"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              className={`
                cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold transition-all
                ${
                  status === filter.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input-border bg-input text-text-muted hover:bg-input-hover hover:text-foreground"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <select
          value={resourceType}
          onChange={(event) =>
            onTypeChange(event.target.value as MonitorTypeFilter)
          }
          className="rounded-xl border border-input-border bg-input px-3 py-2.5 text-sm font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-ring"
        >
          <option value="all">All types</option>
          <option value="website">Website</option>
          <option value="api">API</option>
        </select>
      </div>
    </Tile>
  );
}
