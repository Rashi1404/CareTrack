import { cn } from "@/lib/utils";
import { statusDot, statusTone } from "@/lib/format";
import type { AppointmentStatus } from "@/lib/mock-data";

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        statusTone[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", statusDot[status])} aria-hidden />
      {status}
    </span>
  );
}
