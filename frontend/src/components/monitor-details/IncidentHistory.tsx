import { Clock3 } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/navigation";
import { Tile } from "@/components/tiles";
import type { Incident } from "@/types";
import { formatDateTime, formatDurationBetween } from "@/utils/formatters";

type IncidentHistoryProps = {
  incidents: Incident[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

const PAGE_SIZE = 5;

export default function IncidentHistory({
  incidents,
  isLoading = false,
  isError = false,
  onRetry,
}: IncidentHistoryProps) {
  const [requestedPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(incidents.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const visibleIncidents = incidents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <Tile
      title="Incidents"
      subtitle="Detected downtime periods for this monitor."
    >
      {isLoading && incidents.length === 0 ? (
        <div className="py-10 text-center text-sm font-semibold text-text-muted">
          Loading incidents...
        </div>
      ) : isError ? (
        <div className="py-10 text-center">
          <p className="text-sm font-semibold text-danger">
            Could not load incidents.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 cursor-pointer text-sm font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      ) : incidents.length === 0 ? (
        <div className="py-10 text-center">
          <Clock3 className="mx-auto size-6 text-text-muted" />
          <p className="mt-3 font-semibold text-foreground">
            No incidents recorded
          </p>
          <p className="mt-1 text-sm font-medium text-text-muted">
            Downtime incidents will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleIncidents.map((incident) => (
              <article
                key={incident.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-input/45 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2.5 rounded-full ${
                        incident.status === "open" ? "bg-danger" : "bg-success"
                      }`}
                    />
                    <p className="font-semibold text-foreground">
                      {incident.status === "open"
                        ? "Ongoing incident"
                        : "Resolved incident"}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-muted">
                    {incident.cause ?? "Unknown cause"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatDurationBetween(
                      incident.started_at,
                      incident.resolved_at,
                    )}
                  </p>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    {formatDateTime(incident.started_at)} →{" "}
                    {incident.resolved_at
                      ? formatDateTime(incident.resolved_at)
                      : "now"}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </Tile>
  );
}
