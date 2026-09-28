import { CalendarClock } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { nextAvailable, shortDate } from "@/lib/format";
import type { Doctor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Shows whether a doctor is available today and their next free slot. */
export function AvailabilityBadge({ doctor, className }: { doctor: Doctor; className?: string }) {
  const { appointments } = useApp();
  const next = nextAvailable(doctor, appointments);

  const tone = !next
    ? "bg-destructive/10 text-destructive"
    : next.today
      ? "bg-success/12 text-success"
      : "bg-warning/20 text-warning-foreground";
  const label = !next ? "Fully booked" : next.today ? "Available today" : "Next OPD";

  return (
    <div className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-xs", tone, className)}>
      <span className="relative flex size-2 shrink-0">
        <span className={cn("size-2 rounded-full", !next ? "bg-destructive" : next.today ? "bg-success" : "bg-warning")} />
      </span>
      <span className="font-semibold">{label}</span>
      {next && (
        <span className="ml-auto flex items-center gap-1 font-medium">
          <CalendarClock className="size-3.5" aria-hidden />
          {next.today ? "" : `${shortDate(next.date)} · `}
          {next.time}
        </span>
      )}
    </div>
  );
}
