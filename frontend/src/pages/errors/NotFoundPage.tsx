import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-3xl text-center">
        <p
          className="
            text-[clamp(7rem,24vw,18rem)] font-bold
            leading-none text-foreground
            tracking-[0.2em]
        "
        >
          404
        </p>

        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          This page does not exist.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          And honestly, I do not have a better idea for the design of this page
          yet.
        </p>

        <Link
          to="/"
          className="
            mt-8 inline-flex items-center justify-center
            rounded-xl border border-border
            bg-tile px-4 py-2.5
            text-sm font-semibold
            transition-colors hover:bg-input
      "
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
