import { useId, type CSSProperties } from "react";

type PulseLineProps = {
  className?: string;
  strokeWidth?: number;
  durationSec?: number;
};

export function PulseLine({
  className = "",
  strokeWidth = 4,
  durationSec = 7,
}: PulseLineProps) {
  const uid = useId().replace(/:/g, "");

  const glowId = `pulse-glow-${uid}`;
  const softGlowId = `pulse-soft-glow-${uid}`;
  const gradientId = `pulse-gradient-${uid}`;

  const width = Math.max(0.5, strokeWidth);
  const duration = Math.max(0.1, durationSec);

  const path = `
    M 0 110
    C 100 110, 180 110, 260 110

    C 285 110, 290 85, 305 85
    C 320 85, 320 135, 340 135

    C 360 135, 360 65, 380 65
    C 400 65, 398 140, 415 140

    C 430 140, 430 15, 450 15
    C 470 15, 470 205, 495 205

    C 520 205, 525 55, 550 55
    C 575 55, 575 135, 595 135

    C 610 135, 615 95, 635 95
    C 655 95, 660 110, 690 110

    C 780 110, 880 110, 1000 110
  `;

  const animatedPath =
    "pulse-draw [stroke-dasharray:1_1] [stroke-dashoffset:1]";

  const style = {
    "--pulse-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={style}
    >
      <svg
        viewBox="0 0 1000 220"
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%">
            <stop offset="0%" stopColor="var(--pulse-accent)" stopOpacity="0" />

            <stop
              offset="18%"
              stopColor="var(--pulse-accent)"
              stopOpacity="0.35"
            />

            <stop offset="38%" stopColor="var(--pulse)" stopOpacity="0.9" />

            <stop offset="50%" stopColor="var(--pulse-core)" stopOpacity="1" />

            <stop offset="62%" stopColor="var(--pulse)" stopOpacity="0.9" />

            <stop
              offset="82%"
              stopColor="var(--pulse-accent)"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="var(--pulse-accent)"
              stopOpacity="0"
            />
          </linearGradient>

          <filter id={glowId} x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation={width * 2} />
          </filter>

          <filter id={softGlowId} x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation={width * 5} />
          </filter>
        </defs>

        {/* szeroka poświata */}
        <path
          d={path}
          pathLength="1"
          fill="none"
          strokeWidth={width * 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          filter={`url(#${softGlowId})`}
          className={`${animatedPath} stroke-pulse-soft-glow`}
        />

        {/* mocniejsza poświata */}
        <path
          d={path}
          pathLength="1"
          fill="none"
          strokeWidth={width * 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
          filter={`url(#${glowId})`}
          className={`${animatedPath} stroke-pulse-glow`}
        />

        {/* główna linia */}
        <path
          d={path}
          pathLength="1"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animatedPath}
        />

        {/* jasny rdzeń */}
        <path
          d={path}
          pathLength="1"
          fill="none"
          strokeWidth={width * 0.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${animatedPath} stroke-pulse-core`}
        />
      </svg>

      <style>{`
        .pulse-draw {
          animation: pulse-draw var(--pulse-duration) ease-in-out infinite;
        }

        @keyframes pulse-draw {
          0% {
            stroke-dashoffset: 1;
          }

          55% {
            stroke-dashoffset: 0;
          }

          65% {
            stroke-dashoffset: 0;
          }

          100% {
            stroke-dashoffset: -1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pulse-draw {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
