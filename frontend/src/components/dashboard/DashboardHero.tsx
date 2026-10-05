import { CirclePlus } from "lucide-react";
import { Link } from "react-router";

import { Tile } from "@/components/tiles";

type DashboardHeroProps = {
  email?: string;
  onCreate: () => void;
};

export default function DashboardHero({ email, onCreate }: DashboardHeroProps) {
  const displayName = email?.split("@")[0];

  return (
    <Tile
      variant="primary"
      className="relative overflow-hidden border-primary/20 bg-linear-to-br from-primary to-primary/75"
      padding="lg"
    >
      <div className="relative z-10 flex min-h-58 flex-col justify-between h-full">
        <div>
          <p className="text-sm font-semibold text-white/70">
            Still Up overview
          </p>

          <h1 className="mt-3 max-w-md text-4xl font-semibold tracking-tight text-white">
            Hello{displayName ? `, ${displayName}` : ""}.
          </h1>

          <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-white/75">
            Monitor availability, response time and incidents without turning
            the project into a full observability suite.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:scale-[1.02]"
          >
            <CirclePlus className="size-4" />
            Add monitor
          </button>

          <Link
            to="/monitors"
            className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/15"
          >
            View all monitors
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-24 -right-20 size-72 rounded-full bg-accent/25 blur-3xl" />
    </Tile>
  );
}
