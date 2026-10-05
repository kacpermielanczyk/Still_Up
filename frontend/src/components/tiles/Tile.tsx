import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";

type TileVariant = "default" | "muted" | "primary" | "accent" | "danger";

type TileSurface = "base" | "glass";

type TilePadding = "none" | "sm" | "base" | "lg";

type TileProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    title?: string;
    subtitle?: string;
    action?: ReactNode;

    variant?: TileVariant;
    surface?: TileSurface;
    padding?: TilePadding;

    contentClassName?: string;
  }
>;

const baseVariantClass: Record<TileVariant, string> = {
  default: "border-border bg-tile text-foreground",

  muted: "border-border bg-input/55 text-foreground",

  primary: "border-primary/20 bg-primary/10 text-foreground",

  accent: "border-accent/25 bg-accent/10 text-foreground",

  danger: "border-danger/20 bg-danger/10 text-foreground",
};

const glassVariantClass: Record<TileVariant, string> = {
  default: "tile-glass",

  muted: "tile-glass tile-glass-muted",

  primary: "tile-glass tile-glass-primary",

  accent: "tile-glass tile-glass-accent",

  danger: "tile-glass tile-glass-danger",
};

const contentPaddingClass: Record<TilePadding, string> = {
  none: "",
  sm: "p-3",
  base: "p-4 sm:p-5",
  lg: "p-5 sm:p-6",
};

export default function Tile({
  title,
  subtitle,
  action,

  variant = "default",
  surface = "base",
  padding = "base",

  contentClassName = "",
  className = "",

  children,

  ...props
}: TileProps) {
  const hasHeader = Boolean(title || subtitle || action);

  const appearanceClass =
    surface === "glass"
      ? glassVariantClass[variant]
      : baseVariantClass[variant];

  return (
    <section
      className={`
        overflow-hidden
        rounded-3xl border
        ${appearanceClass}
        ${className}
      `}
      {...props}
    >
      {hasHeader && (
        <div
          className="
            flex items-start justify-between gap-4
            border-b border-border/60
            px-4 py-4 sm:px-5
          "
        >
          <div className="min-w-0">
            {title && (
              <h2 className="text-base font-semibold text-foreground">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm font-medium leading-relaxed text-text-muted">
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div
        className={`
          ${contentPaddingClass[padding]}
          ${contentClassName}
          h-full
        `}
      >
        {children}
      </div>
    </section>
  );
}
