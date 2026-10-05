import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = "",
      wrapperClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold uppercase tracking-wide text-foreground"
          >
            {label}
          </label>
        )}

        <div className="flex flex-col">
          <div className="group relative flex items-center">
            {leftIcon && (
              <span className="pointer-events-none absolute left-3 flex items-center text-text-muted transition-colors group-focus-within:text-primary">
                {leftIcon}
              </span>
            )}

            <input
              ref={ref}
              id={inputId}
              className={`
                w-full rounded-xl border border-input-border bg-input px-3 py-2.5
                text-foreground placeholder:text-input-placeholder placeholder:italic
                outline-none transition-all duration-200
                hover:bg-input-hover focus:bg-input focus:ring-4
                disabled:cursor-not-allowed disabled:opacity-50
                ${leftIcon ? "pl-10" : ""}
                ${rightIcon ? "pr-10" : ""}
                ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/20"
                    : "focus:border-primary focus:ring-primary-ring"
                }
                ${className}
              `}
              {...props}
            />

            {rightIcon && (
              <span className="absolute right-3 flex items-center text-text-muted transition-colors group-focus-within:text-primary">
                {rightIcon}
              </span>
            )}
          </div>

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
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
