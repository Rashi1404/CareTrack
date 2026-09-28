import { Link } from "@tanstack/react-router";
import { Clock3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { useApp } from "@/lib/app-store";
import { dateLabel, estimatedWait } from "@/lib/format";
import type { Appointment } from "@/lib/mock-data";

/** Large, high-contrast live token display shown on the dashboard and tracking page. */
export function LiveQueuePanel({ appt, showTrackLink = false }: { appt: Appointment; showTrackLink?: boolean }) {
  const { doctors, currentToken } = useApp();
  const doctor = doctors.find((d) => d.id === appt.doctorId);
  const current = currentToken(appt.doctorId, appt.date);
  const wait = estimatedWait(appt, current, doctor);
  const ahead = Math.max(appt.token - Math.max(current, 0) - 1, 0);
  const closed = appt.status === "Completed" || appt.status === "Cancelled";

  return (
    <section
      aria-live="polite"
      aria-label="Live token status"
      className="overflow-hidden rounded-2xl border border-primary/20 bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
    >
      <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold">
              <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden /> Live queue
            </span>
            <StatusBadge status={appt.status} className="bg-card" />
          </div>
          <p className="mt-3 truncate font-display text-lg font-semibold">{doctor?.name}</p>
          <p className="truncate text-sm opacity-85">
            {doctor?.department} · {dateLabel(appt.date)} · {appt.time} · {doctor?.room}
          </p>
        </div>
        {showTrackLink && (
          <Button variant="secondary" asChild className="w-full sm:w-auto">
            <Link to="/patient/track/$id" params={{ id: appt.id }}>
              Open live tracking
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px bg-primary-foreground/15 sm:grid-cols-4">
        <Stat label="Your token" value={String(appt.token)} big />
        <Stat label="Now serving" value={current ? String(current) : "—"} big />
        <Stat
          label="Ahead of you"
          value={closed ? "—" : String(ahead)}
          icon={<Users className="size-4" aria-hidden />}
        />
        <Stat
          label="Est. wait"
          value={closed ? "—" : appt.status === "With Doctor" ? "Now" : `${wait} min`}
          icon={<Clock3 className="size-4" aria-hidden />}
        />
      </div>
    </section>
  );
}

function Stat({ label, value, big, icon }: { label: string; value: string; big?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="bg-primary p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-xs font-medium opacity-80">
        {icon}
        {label}
      </p>
      <p className={big ? "mt-1 font-display text-4xl font-bold tabular-nums sm:text-5xl" : "mt-1 font-display text-2xl font-bold tabular-nums"}>
        {value}
      </p>
    </div>
  );
}
