import type { LucideIcon } from "lucide-react";

import Tile from "./Tile";

type StatTileProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
};

const toneClass = {
  default: "bg-input text-text-secondary",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export default function StatTile({
  label,
  value,
  helper,
  icon: Icon,
  tone = "default",
}: StatTileProps) {
  return (
    <Tile className="flex h-full min-h-34 w-full">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${toneClass[tone]}`}
          >
            <Icon className="size-5" />
          </span>

          <p className="text-sm font-semibold text-text-secondary">{label}</p>
        </div>

        <div>
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>

          {helper && (
            <p className="mt-1 text-sm font-medium text-text-muted">{helper}</p>
          )}
        </div>
      </div>
    </Tile>
  );
}
