import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { isApiError } from "@/api/errors";
import Button from "@/components/buttons/Button";
import { useUpdateMonitor } from "@/hooks";
import type { Monitor, MonitorUpdateRequest } from "@/types";

import MonitorFormFields, { type MonitorFormValues } from "./MonitorFormFields";

type EditMonitorFormProps = {
  monitor: Monitor;
  onClose?: () => void;
};

export default function EditMonitorForm({
  monitor,
  onClose,
}: EditMonitorFormProps) {
  const updateMonitor = useUpdateMonitor();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MonitorFormValues>({
    defaultValues: {
      name: monitor.name,
      resource_type: monitor.resource_type,
      url: monitor.url,
      method: monitor.method,
      interval_seconds: monitor.interval_seconds,
      timeout_seconds: monitor.timeout_seconds,
      expected_status_code: monitor.expected_status_code,
      follow_redirects: monitor.follow_redirects,
      enabled: monitor.enabled,
      failure_threshold: monitor.failure_threshold,
      recovery_threshold: monitor.recovery_threshold,
    },
  });

  const onSubmit = async (data: MonitorFormValues) => {
    const payload: MonitorUpdateRequest = {
      name: data.name,
      resource_type: data.resource_type,
      url: data.url,
      method: data.method,
      interval_seconds: data.interval_seconds,
      timeout_seconds: data.timeout_seconds,
      expected_status_code: data.expected_status_code,
      follow_redirects: data.follow_redirects,
      enabled: data.enabled,
      failure_threshold: data.failure_threshold,
      recovery_threshold: data.recovery_threshold,
    };

    try {
      await updateMonitor.mutateAsync({
        monitorId: monitor.id,
        payload,
      });
      onClose?.();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: isApiError(error)
          ? error.message
          : "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <MonitorFormFields register={register} errors={errors} showEnabled />

      {errors.root?.server?.message && (
        <p className="rounded-xl bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {errors.root.server.message}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {onClose && (
          <Button
            text="Cancel"
            icon={X}
            variant="secondary"
            type="button"
            disabled={updateMonitor.isPending}
            onClick={onClose}
          />
        )}

        <Button
          text="Save changes"
          icon={Save}
          type="submit"
          loading={updateMonitor.isPending}
          error={updateMonitor.isError}
        />
      </div>
    </form>
  );
}
