import { MonitorStatsPeriod } from "@/types/common";

type PeriodSelectorProps = {
  value: MonitorStatsPeriod;
  onChange: (value: MonitorStatsPeriod) => void;
};

const periods: MonitorStatsPeriod[] = ["24h", "7d", "30d"];

export default function PeriodSelector({
  value,
  onChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-input p-1">
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={`
            cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all
            ${
              value === period
                ? "bg-surface text-primary shadow-sm"
                : "text-text-muted hover:text-foreground"
            }
          `}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
