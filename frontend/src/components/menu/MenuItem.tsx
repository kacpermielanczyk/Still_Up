import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router";

type MenuItemProps = {
  name: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  onClick?: () => void;
};

export default function MenuItem({
  name,
  to,
  icon: Icon,
  end = false,
  onClick,
}: MenuItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold
        transition-all duration-200
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-muted hover:bg-input-hover hover:text-foreground"
        }
      `}
    >
      <Icon className="size-5 shrink-0" />
      <span>{name}</span>
    </NavLink>
  );
}
