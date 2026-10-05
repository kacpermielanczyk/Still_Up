import { Activity } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/navigation";
import { Tile } from "@/components/tiles";
import type { MonitorCheck } from "@/types";
import { formatDateTime, formatMilliseconds } from "@/utils/formatters";

type CheckHistoryProps = {
  checks: MonitorCheck[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

const PAGE_SIZE = 8;

export default function CheckHistory({
  checks,
  isLoading = false,
  isError = false,
  onRetry,
}: CheckHistoryProps) {
  const [requestedPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(checks.length / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const visibleChecks = checks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Tile
      title="Check history"
      subtitle="Latest HTTP checks performed for this monitor."
      action={
        <span className="flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Activity className="size-4" />
          {checks.length} loaded
        </span>
      }
      padding="none"
    >
      {isLoading && checks.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm font-semibold text-text-muted">
          Loading checks...
        </div>
      ) : isError ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-semibold text-danger">
            Could not load check history.
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
      ) : checks.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm font-medium text-text-muted">
          No checks recorded yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead>
                <tr className="border-b border-border bg-input/45">
                  {["Time", "Status", "HTTP", "Response", "Error"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {visibleChecks.map((check) => (
                  <tr
                    key={check.id}
                    className="border-b border-border transition-colors last:border-b-0 hover:bg-input/25"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-text-secondary">
                      {formatDateTime(check.checked_at)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          check.status === "success"
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {check.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">
                      {check.status_code ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-foreground">
                      {formatMilliseconds(check.response_time_ms)}
                    </td>
                    <td className="max-w-sm px-5 py-4">
                      <p className="truncate text-sm font-medium text-text-muted">
                        {check.error_message ?? check.error_type ?? "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row">
            <p className="text-sm font-medium text-text-muted">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, checks.length)} of {checks.length}
            </p>
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
