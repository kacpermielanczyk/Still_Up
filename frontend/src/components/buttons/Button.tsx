import { LoaderCircle, RotateCcw, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonSize = "sm" | "base" | "lg";
type ButtonVariant = "primary" | "secondary" | "accent" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: ButtonVariant;
  paddingSize?: ButtonSize;
  textSize?: ButtonSize;
  icon?: LucideIcon;
  loading?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border-primary bg-primary/80 text-white after:bg-primary before:bg-primary",
  secondary:
    "border-primary/40 bg-primary/10 text-primary after:bg-primary/10 before:bg-primary/10",
  accent:
    "border-accent bg-accent/80 text-white after:bg-accent before:bg-accent",
  danger:
    "border-danger/35 bg-danger/10 text-danger after:bg-danger/10 before:bg-danger/10",
};

const paddingClass: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5",
  base: "px-4 py-2.5",
  lg: "px-5 py-3",
};

const textClass: Record<ButtonSize, string> = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

export default function Button({
  text,
  variant = "primary",
  paddingSize = "base",
  textSize = "base",
  icon: Icon,
  loading = false,
  error = false,
  fullWidth = true,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        group/btn relative flex items-center justify-center gap-2 overflow-hidden
        rounded-xl border-2 font-semibold outline-none transition-all duration-300
        not-disabled:cursor-pointer not-disabled:hover:scale-[1.02]
        not-disabled:active:scale-100
        disabled:cursor-not-allowed disabled:opacity-60
        after:absolute after:left-0 after:top-0 after:z-0 after:h-0 after:w-0
        after:transition-all after:duration-300 after:ease-in-out
        before:absolute before:bottom-0 before:right-0 before:z-0 before:h-0 before:w-0
        before:transition-all before:duration-300 before:ease-in-out
        not-disabled:hover:after:h-[110%] not-disabled:hover:after:w-[110%]
        not-disabled:hover:before:h-[110%] not-disabled:hover:before:w-[110%]
        ${error ? "border-danger bg-danger/25 text-danger" : variantClass[variant]}
        ${paddingClass[paddingSize]}
        ${textClass[textSize]}
        ${fullWidth ? "w-full" : "w-auto"}
        ${loading ? "cursor-progress" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10">
        {loading ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : error ? (
          <RotateCcw className="size-5 transition-transform duration-500 group-hover/btn:-rotate-360" />
        ) : (
          Icon && <Icon className="size-5" />
        )}
      </span>

      <span className="relative z-10">{text}</span>
    </button>
  );
}
