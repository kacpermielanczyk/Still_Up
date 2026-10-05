import { forwardRef, useId, type SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  wrapperClassName?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      className = "",
      wrapperClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`
            w-full rounded-xl border border-input-border bg-input px-3 py-2.5
            text-foreground outline-none transition-all duration-200
            hover:bg-input-hover focus:bg-input focus:ring-4
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "focus:border-primary focus:ring-primary-ring"
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {(error || helperText) && (
          <p
            className={`mt-1 text-sm font-medium leading-tight ${
              error ? "text-danger" : "text-text-muted"
            }`}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
