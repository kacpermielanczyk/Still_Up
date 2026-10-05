import { forwardRef, useId, type InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  helperText?: string;
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={`
            flex cursor-pointer items-start gap-3 rounded-xl border border-input-border
            bg-input px-3 py-2.5 transition-all duration-200 hover:bg-input-hover
            ${error ? "border-danger" : ""}
          `}
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`
              mt-0.5 size-4 cursor-pointer accent-primary
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
          />

          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {label}
            </span>

            {helperText && !error && (
              <span className="text-sm font-medium leading-tight text-text-muted">
                {helperText}
              </span>
            )}
          </span>
        </label>

        {error && (
          <p className="text-sm font-medium leading-tight text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
