import type { ReactNode } from "react";
import Brand from "../components/Brand";
import { PulseLine } from "../components/PulseLine";

type CardInfoProps = {
  idx: number;
  text: string;
  isActive: boolean;
};

type AuthCard = Omit<CardInfoProps, "idx" | "isActive">;

type AuthLayoutProps = {
  children: ReactNode;

  info: {
    title: string;
    subtitle: string;
    activeCard: number;
    cards: AuthCard[];
  };
};

export default function AuthLayout({ children, info }: AuthLayoutProps) {
  const { activeCard, title, subtitle, cards } = info;

  return (
    <main className="min-h-screen p-2 sm:p-4">
      <div
        className="
          grid min-h-[calc(100vh-1rem)] grid-cols-1 gap-2 
          sm:min-h-[calc(100vh-2rem)] sm:gap-4 lg:grid-cols-5
        "
      >
        {/* LEFT / INFO */}
        <section
          className="
            relative min-h-130 overflow-hidden 
            rounded-4xl lg:col-span-3 lg:min-h-0
          "
        >
          <AuthBackground />

          {/* Content */}
          <div
            className="
              relative z-10 flex min-h-130 flex-col justify-between bg-surface/60 p-6 
              backdrop-blur-md sm:p-8 lg:h-full lg:min-h-0 lg:p-10
            "
          >
            <Brand />

            <div className="mt-20 lg:mt-10">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                  {title}
                </h1>

                <p className="mt-3 text-sm font-medium text-text-muted sm:text-base">
                  {subtitle}
                </p>
              </div>

              {cards.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mt-10">
                  {cards.map((card, idx) => (
                    <CardInfo
                      key={`${idx}-${card.text}`}
                      {...card}
                      idx={idx + 1}
                      isActive={activeCard === idx}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT / FORM */}
        <section
          className="
            flex min-h-125 items-center justify-center rounded-4xl px-5 
            py-10 sm:px-8 lg:col-span-2 lg:min-h-0 lg:px-10 xl:px-14
          "
        >
          <div className="w-full max-w-115">{children}</div>
        </section>
      </div>
    </main>
  );
}

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-4xl">
      {/* Base */}
      <div className="absolute inset-0 bg-surface/10" />

      {/* Blobsiki */}
      <div
        className="
          absolute left-[-32%] top-[-12%] h-[70%] w-[75%] rounded-full bg-primary opacity-70 blur-[80px] sm:blur-[100px]
        "
      />

      <div
        className="
          absolute bottom-[-18%] left-[5%] h-[50%] w-[48%] rounded-full 
          bg-text-muted opacity-65 blur-[90px] sm:blur-[120px]
        "
      />

      <div
        className="
          absolute bottom-[-5%] right-[5%] h-[48%] w-[48%] 
          rounded-full bg-accent opacity-60 blur-[80px] sm:blur-[110px]
        "
      />

      <div
        className="
          absolute left-[30%] top-[20%] h-[50%] w-[45%] rounded-full bg-primary 
          opacity-70 blur-[100px] sm:blur-[130px]
        "
      />

      {/* Depth */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Pulse */}
      <div
        className=" 
          absolute inset-x-[-10%] top-[22%] flex h-[45%] items-center
          justify-center opacity-70 sm:inset-x-[-5%] lg:top-[20%] lg:h-[50%]
        "
      >
        <PulseLine
          durationSec={16}
          strokeWidth={16}
          className="h-full w-full"
        />
      </div>

      {/* Grain */}
      <div className="grain absolute inset-0" />

      {/* subtle contrast */}
      <div className="absolute inset-0 bg-linear-to-t from-background/55 via-transparent to-transparent" />
    </div>
  );
}

function CardInfo({ idx, text, isActive }: CardInfoProps) {
  return (
    <div
      className={`
        flex min-w-0 flex-col justify-between gap-10 rounded-2xl border p-4 sm:min-h-37 lg:min-h-42

        ${
          isActive
            ? ` border-primary bg-primary text-white`
            : ` border-surface/50 bg-surface/5 text-text-secondary backdrop-blur-xl`
        }
      `}
    >
      <span
        className={`
          flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold

          ${
            isActive ? "border-white text-white" : "border-primary text-primary"
          }
        `}
      >
        {idx}
      </span>

      <span className="text-sm font-semibold sm:text-base">{text}</span>
    </div>
  );
}
