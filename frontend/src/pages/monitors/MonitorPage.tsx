import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";

import {
  CheckHistory,
  IncidentHistory,
  MonitorConfiguration,
  MonitorHeader,
  MonitorPerformance,
  MonitorStatistics,
  MonitorSummary,
} from "@/components/monitor-details";
import { DeleteMonitorModal, EditMonitorModal } from "@/components/modals";
import { Tile } from "@/components/tiles";
import {
  useCheckMonitorNow,
  useMonitor,
  useMonitorChecks,
  useMonitorIncidents,
  useMonitorStats,
  useUpdateMonitor,
} from "@/hooks";
import { MonitorStatsPeriod } from "@/types/common";

export default function MonitorPage() {
  const { monitorId: monitorIdParam } = useParams();
  const monitorId = Number(monitorIdParam);

  const [period, setPeriod] = useState<MonitorStatsPeriod>("24h");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const monitorQuery = useMonitor(monitorId);
  const checksQuery = useMonitorChecks(monitorId, 100);
  const incidentsQuery = useMonitorIncidents(monitorId, 50);
  const statsQuery = useMonitorStats(monitorId, period);

  const checkNow = useCheckMonitorNow();
  const updateMonitor = useUpdateMonitor();

  if (!Number.isInteger(monitorId) || monitorId <= 0) {
    return (
      <PageWrapper>
        <Tile variant="danger">
          <p className="font-semibold text-foreground">Invalid monitor id.</p>
          <Link
            to="/monitors"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Back to monitors
          </Link>
        </Tile>
      </PageWrapper>
    );
  }

  if (monitorQuery.isError) {
    return (
      <PageWrapper>
        <Tile variant="danger">
          <div className="py-10 text-center">
            <p className="font-semibold text-foreground">
              Could not load this monitor.
            </p>
            <button
              type="button"
              onClick={() => monitorQuery.refetch()}
              className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </Tile>
      </PageWrapper>
    );
  }

  if (monitorQuery.isPending || !monitorQuery.data) {
    return (
      <PageWrapper>
        <Tile>
          <div className="py-16 text-center text-sm font-semibold text-text-muted">
            Loading monitor...
          </div>
        </Tile>
      </PageWrapper>
    );
  }

  const monitor = monitorQuery.data;
  const checks = checksQuery.data ?? [];
  const incidents = incidentsQuery.data ?? [];

  const toggleEnabled = () => {
    updateMonitor.mutate({
      monitorId: monitor.id,
      payload: { enabled: !monitor.enabled },
    });
  };

  return (
    <>
      <PageWrapper>
        <MonitorHeader
          monitor={monitor}
          checking={checkNow.isPending}
          updating={updateMonitor.isPending}
          onCheckNow={() => checkNow.mutate(monitor.id)}
          onToggleEnabled={toggleEnabled}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteOpen(true)}
        />

        <MonitorSummary
          stats={statsQuery.data}
          period={period}
          checks={checks}
          incidentCount={incidents.length}
        />

        <MonitorPerformance monitor={monitor} checks={checks} />

        <section className="grid gap-5 xl:grid-cols-2">
          <MonitorStatistics
            stats={statsQuery.data}
            period={period}
            onPeriodChange={setPeriod}
            isLoading={statsQuery.isPending}
          />
          <MonitorConfiguration monitor={monitor} />
        </section>

        <CheckHistory
          checks={checks}
          isLoading={checksQuery.isPending}
          isError={checksQuery.isError}
          onRetry={() => checksQuery.refetch()}
        />

        <IncidentHistory
          incidents={incidents}
          isLoading={incidentsQuery.isPending}
          isError={incidentsQuery.isError}
          onRetry={() => incidentsQuery.refetch()}
        />
      </PageWrapper>

      <EditMonitorModal
        open={editOpen}
        monitor={monitor}
        onClose={() => setEditOpen(false)}
      />

      <DeleteMonitorModal
        open={deleteOpen}
        monitor={monitor}
        onClose={() => setDeleteOpen(false)}
        navigateAfterDelete
      />
    </>
  );
}

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-375 flex-col gap-5 p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
}
