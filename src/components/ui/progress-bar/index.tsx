import { cn } from "@/src/lib/utils";

type ProgressTone = "auto" | "primary" | "success" | "warning" | "danger";

type ProgressBarProps = {
  value: number;
  max: number;
  tone?: ProgressTone;
  className?: string;
  "aria-label"?: string;
};

const toneStyles: Record<Exclude<ProgressTone, "auto">, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

function resolveTone(tone: ProgressTone, percent: number) {
  if (tone !== "auto") return tone;
  if (percent >= 100) return "danger";
  if (percent >= 80) return "warning";
  return "primary";
}

export function ProgressBar({
  value,
  max,
  tone = "auto",
  className,
  "aria-label": ariaLabel,
}: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const percent =
    max > 0 ? (safeValue / max) * 100 : safeValue > 0 ? 100 : 0;
  const width = Math.min(100, Math.max(0, percent));
  const resolved = resolveTone(tone, percent);

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={safeValue}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          toneStyles[resolved]
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export type { ProgressBarProps, ProgressTone };
