import { LoaderCircle, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type MonitorActionTone = "neutral" | "primary" | "danger";

type MonitorActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  icon: LucideIcon;
  tone?: MonitorActionTone;
  loading?: boolean;
};

const toneClass: Record<MonitorActionTone, string> = {
  neutral:
    "border-input-border bg-input text-text-secondary hover:bg-input-hover hover:text-foreground",
  primary:
    "border-primary/35 bg-primary/10 text-primary hover:bg-primary/15",
  danger:
    "border-danger/25 bg-danger/10 text-danger hover:bg-danger/15",
};

export default function MonitorActionButton({
  text,
  icon: Icon,
  tone = "neutral",
  loading = false,
  disabled,
  className = "",
  ...props
}: MonitorActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`
        inline-flex min-h-10 cursor-pointer items-center justify-center gap-2
        rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all
        hover:-translate-y-px active:translate-y-0
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0
        ${toneClass[tone]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Icon className="size-4" />
      )}
      <span>{text}</span>
    </button>
  );
}
