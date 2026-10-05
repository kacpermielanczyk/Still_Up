import { Trash2, X } from "lucide-react";
import { useState } from "react";

import { isApiError } from "@/api/errors";
import Button from "@/components/buttons/Button";
import { useDeleteMonitor } from "@/hooks";
import type { Monitor } from "@/types";
import { MonitorItem } from "@/components/monitors";

type DeleteMonitorFormProps = {
  monitor: Monitor;
  onClose?: () => void;
  onDeleted?: () => void;
};

export default function DeleteMonitorForm({
  monitor,
  onClose,
  onDeleted,
}: DeleteMonitorFormProps) {
  const deleteMonitor = useDeleteMonitor();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);

    try {
      await deleteMonitor.mutateAsync(monitor.id);
      onDeleted?.();
      onClose?.();
    } catch (error) {
      setErrorMessage(
        isApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <MonitorItem name={monitor.name} url={monitor.url} />

      <p className="text-sm font-medium leading-relaxed text-text-muted">
        Deleting this monitor also removes its check history and incidents. This
        action cannot be undone.
      </p>

      {errorMessage && (
        <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {onClose && (
          <Button
            text="Cancel"
            icon={X}
            variant="secondary"
            type="button"
            disabled={deleteMonitor.isPending}
            onClick={onClose}
          />
        )}

        <Button
          text="Delete monitor"
          icon={Trash2}
          variant="danger"
          type="button"
          loading={deleteMonitor.isPending}
          error={deleteMonitor.isError}
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}
