import type { MonitorCheck } from "@/types";

type ResponseTimeChartProps = {
  checks: MonitorCheck[];
};

const WIDTH = 760;
const HEIGHT = 240;

const PADDING = {
  top: 18,
  right: 20,
  bottom: 34,
  left: 52,
};

const GRID_LINES = 4;

export default function ResponseTimeChart({ checks }: ResponseTimeChartProps) {
  const samples = checks
    .slice(0, 40)
    .reverse()
    .filter(
      (
        check,
      ): check is MonitorCheck & {
        response_time_ms: number;
      } => check.response_time_ms !== null,
    );

  if (samples.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-medium text-text-muted">
          Not enough response data yet.
        </p>
      </div>
    );
  }

  const values = samples.map((check) => check.response_time_ms);

  const average = values.reduce((sum, value) => sum + value, 0) / values.length;

  const rawMax = Math.max(...values);

  // zostawiam trochę miejsca nad najwyższym punktem
  const maxValue = Math.max(100, Math.ceil(rawMax * 1.15));

  const chartWidth = WIDTH - PADDING.left - PADDING.right;

  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const getX = (index: number) => {
    if (samples.length === 1) {
      return PADDING.left;
    }

    return PADDING.left + (index / (samples.length - 1)) * chartWidth;
  };

  const getY = (value: number) =>
    PADDING.top + chartHeight - (value / maxValue) * chartHeight;

  const points = samples.map((check, index) => ({
    x: getX(index),
    y: getY(check.response_time_ms),
    check,
  }));

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points.at(-1)!.x} ${PADDING.top + chartHeight}
    L ${points[0].x} ${PADDING.top + chartHeight}
    Z
  `;

  const averageY = getY(average);

  const gridValues = Array.from(
    {
      length: GRID_LINES + 1,
    },
    (_, index) => (maxValue / GRID_LINES) * index,
  ).reverse();

  const first = samples[0];

  const middle = samples[Math.floor(samples.length / 2)];

  const last = samples.at(-1)!;

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-5">
        <Legend className="bg-primary" label="Response time" />

        <Legend
          className="bg-warning"
          label={`Average ${Math.round(average)} ms`}
        />

        <Legend className="bg-danger" label="Failed check" />
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full">
          <defs>
            <linearGradient id="responseArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />

              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* horizontal grid + Y axis */}
          {gridValues.map((value) => {
            const y = getY(value);

            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={WIDTH - PADDING.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />

                <text
                  x={PADDING.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {Math.round(value)} ms
                </text>
              </g>
            );
          })}

          {/* average reference */}
          <line
            x1={PADDING.left}
            y1={averageY}
            x2={WIDTH - PADDING.right}
            y2={averageY}
            stroke="var(--warning)"
            strokeWidth="1.5"
            strokeDasharray="7 6"
            opacity="0.9"
          />

          <text
            x={WIDTH - PADDING.right}
            y={averageY - 7}
            textAnchor="end"
            fill="var(--warning)"
            fontSize="11"
            fontWeight="700"
          >
            AVG {Math.round(average)} ms
          </text>

          {/* area */}
          <path d={areaPath} fill="url(#responseArea)" />

          {/* actual response line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* points */}
          {points.map(({ x, y, check }) => (
            <circle
              key={check.id}
              cx={x}
              cy={y}
              r={check.status === "failure" ? 5 : 3.5}
              fill={
                check.status === "failure" ? "var(--danger)" : "var(--primary)"
              }
              stroke="var(--tile)"
              strokeWidth="2"
            >
              <title>{`${check.response_time_ms} ms · ${check.status}`}</title>
            </circle>
          ))}

          {/* X labels */}
          <TimeLabel x={PADDING.left} value={first.checked_at} anchor="start" />

          <TimeLabel
            x={PADDING.left + chartWidth / 2}
            value={middle.checked_at}
            anchor="middle"
          />

          <TimeLabel
            x={WIDTH - PADDING.right}
            value={last.checked_at}
            anchor="end"
          />
        </svg>
      </div>
    </div>
  );
}

function Legend({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${className}`} />

      <span className="text-xs font-semibold text-text-muted">{label}</span>
    </div>
  );
}

function TimeLabel({
  x,
  value,
  anchor,
}: {
  x: number;
  value: string;
  anchor: "start" | "middle" | "end";
}) {
  const date = new Date(value);

  const label = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <text
      x={x}
      y={HEIGHT - 8}
      textAnchor={anchor}
      fill="var(--text-muted)"
      fontSize="11"
      fontWeight="600"
    >
      {label}
    </text>
  );
}
