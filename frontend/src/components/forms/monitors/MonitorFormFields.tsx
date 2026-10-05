import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import Checkbox from "@/components/inputs/Checkbox";
import Input from "@/components/inputs/Input";
import Select from "@/components/inputs/Select";
import type { MonitorCreateFormValues } from "@/types";

export type MonitorFormValues = MonitorCreateFormValues & {
  enabled?: boolean;
};

type MonitorFormFieldsProps = {
  register: UseFormRegister<MonitorFormValues>;
  errors: FieldErrors<MonitorFormValues>;
  showEnabled?: boolean;
};

const resourceTypeOptions = [
  { label: "Website", value: "website" },
  { label: "API", value: "api" },
];

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "HEAD", value: "HEAD" },
];

export default function MonitorFormFields({
  register,
  errors,
  showEnabled = false,
}: MonitorFormFieldsProps) {
  return (
    <div className="flex flex-col gap-6">
      <FormSection title="Resource" description="What should Still Up request?">
        <Input
          label="Name"
          placeholder="Production API"
          autoComplete="off"
          {...register("name", {
            required: "Name is required",
            maxLength: {
              value: 100,
              message: "Name must be at most 100 characters",
            },
          })}
          error={errors.name?.message}
        />

        <div className="grid gap-3 md:grid-cols-2">
          <Select
            label="Resource type"
            options={resourceTypeOptions}
            {...register("resource_type", {
              required: "Resource type is required",
            })}
            error={errors.resource_type?.message}
          />

          <Select
            label="HTTP method"
            options={methodOptions}
            {...register("method", {
              required: "HTTP method is required",
            })}
            error={errors.method?.message}
          />
        </div>

        <Input
          label="URL"
          placeholder="https://example.com/health"
          type="url"
          autoComplete="url"
          {...register("url", {
            required: "URL is required",
            validate: validateHttpUrl,
          })}
          error={errors.url?.message}
        />
      </FormSection>

      <FormSection title="Schedule" description="How often should the worker check it?">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Check interval"
            type="number"
            min={10}
            max={3600}
            step={1}
            helperText="Seconds between checks (10–3600)"
            {...register("interval_seconds", numberRules(10, 3600, "interval"))}
            error={errors.interval_seconds?.message}
          />

          <Input
            label="Timeout"
            type="number"
            min={1}
            max={30}
            step={1}
            helperText="Maximum request time in seconds"
            {...register("timeout_seconds", numberRules(1, 30, "timeout"))}
            error={errors.timeout_seconds?.message}
          />
        </div>
      </FormSection>

      <FormSection title="Response policy" description="Define what counts as a healthy response.">
        <Input
          label="Expected status code"
          type="number"
          min={100}
          max={599}
          step={1}
          placeholder="Any 2xx / 3xx"
          helperText="Leave empty to accept every HTTP status from 200 to 399"
          {...register("expected_status_code", {
            setValueAs: (value) =>
              value === "" || value == null ? null : Number(value),
            validate: (value) =>
              value == null ||
              (value >= 100 && value <= 599) ||
              "Status code must be between 100 and 599",
          })}
          error={errors.expected_status_code?.message}
        />

        <Checkbox
          label="Follow redirects"
          helperText="Allow HTTP redirects automatically"
          {...register("follow_redirects")}
          error={errors.follow_redirects?.message}
        />

        {showEnabled && (
          <Checkbox
            label="Monitoring enabled"
            helperText="Disable this to pause automatic checks"
            {...register("enabled")}
            error={errors.enabled?.message}
          />
        )}
      </FormSection>

      <FormSection title="State thresholds" description="Avoid changing status because of a single noisy request.">
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Failure threshold"
            type="number"
            min={1}
            max={10}
            step={1}
            helperText="Failures required before DOWN"
            {...register("failure_threshold", numberRules(1, 10, "threshold"))}
            error={errors.failure_threshold?.message}
          />

          <Input
            label="Recovery threshold"
            type="number"
            min={1}
            max={10}
            step={1}
            helperText="Successes required before UP"
            {...register("recovery_threshold", numberRules(1, 10, "threshold"))}
            error={errors.recovery_threshold?.message}
          />
        </div>
      </FormSection>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs font-medium text-text-muted">{description}</p>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function validateHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      "URL must use http:// or https://"
    );
  } catch {
    return "Enter a valid URL";
  }
}

function numberRules(min: number, max: number, field: string) {
  return {
    required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
    valueAsNumber: true,
    min: {
      value: min,
      message: `Minimum value is ${min}`,
    },
    max: {
      value: max,
      message: `Maximum value is ${max}`,
    },
  } as const;
}
