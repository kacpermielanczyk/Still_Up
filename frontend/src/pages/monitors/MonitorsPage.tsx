import { CirclePlus } from "lucide-react";
import { useMemo, useState } from "react";

import {
  CreateMonitorModal,
  DeleteMonitorModal,
  EditMonitorModal,
} from "@/components/modals";
import { Pagination } from "@/components/navigation";
import {
  MonitorCard,
  MonitorFilters,
  type MonitorStatusFilter,
  type MonitorTypeFilter,
} from "@/components/monitors";
import { Tile } from "@/components/tiles";
import { useMonitors } from "@/hooks";
import type { Monitor } from "@/types";

const PAGE_SIZE = 8;
const EMPTY_MONITORS: Monitor[] = [];

export default function MonitorsPage() {
  const monitorsQuery = useMonitors();
  const monitors = monitorsQuery.data ?? EMPTY_MONITORS;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MonitorStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<MonitorTypeFilter>("all");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editMonitor, setEditMonitor] = useState<Monitor | null>(null);
  const [deleteMonitor, setDeleteMonitor] = useState<Monitor | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return monitors.filter((monitor) => {
      const matchesSearch =
        query.length === 0 ||
        monitor.name.toLowerCase().includes(query) ||
        monitor.url.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "paused"
          ? !monitor.enabled
          : monitor.enabled && monitor.status === statusFilter);

      const matchesType =
        typeFilter === "all" || monitor.resource_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [monitors, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleMonitors = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetPage = () => setPage(1);

  return (
    <>
      <div className="mx-auto flex w-full max-w-375 flex-col gap-5 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Monitoring</p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
              Monitors
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-text-muted">
              Manage websites and API endpoints, then drill into checks,
              incidents and response times.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="
              inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary 
              bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-primary-hover
            "
          >
            <CirclePlus className="size-4" />
            Add monitor
          </button>
        </header>

        <MonitorFilters
          search={search}
          status={statusFilter}
          resourceType={typeFilter}
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          onStatusChange={(value) => {
            setStatusFilter(value);
            resetPage();
          }}
          onTypeChange={(value) => {
            setTypeFilter(value);
            resetPage();
          }}
        />

        {monitorsQuery.isPending ? (
          <Tile>
            <div className="py-16 text-center font-semibold text-text-muted">
              Loading monitors...
            </div>
          </Tile>
        ) : monitorsQuery.isError ? (
          <Tile variant="danger">
            <div className="py-12 text-center">
              <p className="font-semibold text-foreground">
                Could not load monitors
              </p>
              <button
                type="button"
                onClick={() => monitorsQuery.refetch()}
                className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </Tile>
        ) : filtered.length === 0 ? (
          <Tile>
            <div className="py-16 text-center">
              <p className="font-semibold text-foreground">
                No matching monitors
              </p>
              <p className="mt-1 text-sm font-medium text-text-muted">
                Change the filters or create another resource.
              </p>
            </div>
          </Tile>
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleMonitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onEdit={setEditMonitor}
                  onDelete={setDeleteMonitor}
                />
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm font-medium text-text-muted">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>

              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      <CreateMonitorModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditMonitorModal
        open={editMonitor !== null}
        monitor={editMonitor}
        onClose={() => setEditMonitor(null)}
      />
      <DeleteMonitorModal
        open={deleteMonitor !== null}
        monitor={deleteMonitor}
        onClose={() => setDeleteMonitor(null)}
      />
    </>
  );
}
