import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { isApiError } from "@/api/errors";
import Button from "@/components/buttons/Button";
import { useCreateMonitor } from "@/hooks";

import MonitorFormFields, { type MonitorFormValues } from "./MonitorFormFields";

type CreateMonitorFormProps = {
  onClose?: () => void;
};

export default function CreateMonitorForm({ onClose }: CreateMonitorFormProps) {
  const createMonitor = useCreateMonitor();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MonitorFormValues>({
    defaultValues: {
      name: "",
      resource_type: "website",
      url: "",
      method: "GET",
      interval_seconds: 60,
      timeout_seconds: 5,
      expected_status_code: null,
      follow_redirects: true,
      failure_threshold: 2,
      recovery_threshold: 1,
    },
  });

  const onSubmit = async (data: MonitorFormValues) => {
    try {
      await createMonitor.mutateAsync(data);
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
      <MonitorFormFields register={register} errors={errors} />

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
            disabled={createMonitor.isPending}
            onClick={onClose}
          />
        )}

        <Button
          text="Create monitor"
          icon={Plus}
          type="submit"
          loading={createMonitor.isPending}
          error={createMonitor.isError}
        />
      </div>
    </form>
  );
}
