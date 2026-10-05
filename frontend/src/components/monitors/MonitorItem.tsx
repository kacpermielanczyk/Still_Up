import { MonitorStatus } from "@/types/common";
import MonitorStatusBadge from "./MonitorStatusBadge";

type MonitorItemProps = {
  name: string;
  url: string;
  status?: MonitorStatus;
};

export default function MonitorItem({ name, url, status }: MonitorItemProps) {
  return (
    <div
      className={`
        rounded-2xl border border-input-border bg-input px-4 py-3
        ${status && "flex items-center justify-between hover:bg-input-hover transition-all hover:border-primary/40"}
    `}
    >
      <div className="flex flex-col">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="mt-1 break-all text-sm font-medium text-text-muted">
          {url}
        </p>
      </div>

      {status && <MonitorStatusBadge status={status} compact />}
    </div>
  );
}
