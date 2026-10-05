import { Activity, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

import Brand from "@/components/Brand";
import ThemeSwitch from "@/components/switches/ThemeSwitch";
import { useAuthContext } from "@/contexts";

import MenuItem from "./MenuItem";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthContext();

  const closeMenu = () => setIsOpen(false);
  const userLabel = user?.email ?? "Signed in";
  const initial = userLabel.charAt(0).toUpperCase();

  return (
    <>
      <div
        className="fixed top-0 z-30 flex h-16 items-center justify-between w-full
                  border-b border-border bg-background/90 px-4 backdrop-blur md:hidden"
      >
        <Brand />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex size-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-all hover:bg-input-hover"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          onClick={closeMenu}
          className="fixed inset-0 z-40 cursor-default bg-modal-overlay backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[min(17rem,calc(100vw-1.5rem))] p-2
          transition-transform duration-200 ease-out
          md:sticky md:top-0 md:z-auto md:h-dvh md:w-64 md:shrink-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <nav className="flex h-full min-h-0 flex-col rounded-3xl border border-border bg-surface p-3 shadow-sm">
          <div className="flex items-center justify-between px-1 py-1">
            <Brand />

            <button
              type="button"
              onClick={closeMenu}
              className="flex size-9 cursor-pointer items-center justify-center rounded-xl border 
              border-border bg-input text-text-muted transition-all hover:bg-input-hover hover:text-foreground md:hidden"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-8 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Workspace
            </p>

            <MenuItem
              name="Overview"
              to="/"
              icon={LayoutDashboard}
              end
              onClick={closeMenu}
            />

            <MenuItem
              name="Monitors"
              to="/monitors"
              icon={Activity}
              onClick={closeMenu}
            />
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <ThemeSwitch />

            <div className="flex items-center gap-3 rounded-xl border border-border bg-input/60 p-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {initial}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {userLabel}
                </p>
                <p className="text-xs font-medium text-text-muted">Account</p>
              </div>

              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-text-muted transition-all hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
