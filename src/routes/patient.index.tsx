import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock3, Search, Ticket } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AppointmentCard } from "@/components/appointment-card";
import { LiveQueuePanel } from "@/components/live-queue-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/lib/app-store";
import { estimatedWait, dateLabel } from "@/lib/format";
import { today } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — CareTrack" },
      {
        name: "description",
        content: "Your upcoming OPD visits, live token status and appointment history in CareTrack.",
      },
      { property: "og:title", content: "Patient Dashboard — CareTrack" },
      { property: "og:description", content: "Upcoming visits, token status and history." },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const { user, appointments, doctors, currentToken } = useApp();
  const id = user?.id ?? "p1";
  const mine = appointments.filter((a) => a.patientId === id);
  const upcoming = mine
    .filter((a) => a.status !== "Completed" && a.status !== "Cancelled")
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];
  const doctor = next ? doctors.find((d) => d.id === next.doctorId) : undefined;
  const current = next ? currentToken(next.doctorId, next.date) : 0;
  const wait = next ? estimatedWait(next, current, doctor) : 0;
  const completed = mine.filter((a) => a.status === "Completed");

  const stats = [
    { icon: CalendarDays, label: "Upcoming visits", value: upcoming.length },
    { icon: CheckCircle2, label: "Completed visits", value: completed.length },
    { icon: Ticket, label: "Today's token", value: next?.date === today ? next.token : "—" },
    { icon: Clock3, label: "Est. wait", value: next?.date === today ? `${wait} min` : "—" },
  ];

  return (
    <AppShell
      title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`}
      subtitle="Here's what's happening with your care today"
      action={
        <Button asChild>
          <Link to="/patient/find">
            <Search className="mr-2 size-4" /> Find a doctor
          </Link>
        </Button>
      }
    >
      {next && (
        <div className="mb-6">
          <LiveQueuePanel appt={next} showTrackLink />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border">
            <CardContent className="p-5">
              <s.icon className="size-5 text-accent-foreground" />
              <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <h2 className="text-lg font-semibold">Upcoming appointments</h2>
          <div className="mt-4 space-y-4">
            {upcoming.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-10 text-center">
                  <p className="font-medium">No upcoming appointments</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Search for a specialist and book your next OPD visit.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/patient/find">Find a doctor</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)
            )}
          </div>

          <h2 className="mt-8 text-lg font-semibold">Recent visits</h2>
          <div className="mt-4 space-y-4">
            {completed.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  Completed visits will appear here with notes and prescriptions.
                </CardContent>
              </Card>
            ) : (
              completed.slice(0, 2).map((a) => <AppointmentCard key={a.id} appt={a} />)
            )}
            <Button variant="outline" className="w-full" asChild>
              <Link to="/patient/history">View full history</Link>
            </Button>
          </div>
        </section>

        <aside className="space-y-4">
          {next && (
            <Card className="border-border bg-primary text-primary-foreground">
              <CardContent className="p-5">
                <p className="text-xs opacity-80">Next appointment</p>
                <p className="mt-1 font-display text-lg font-semibold">{doctor?.name}</p>
                <p className="text-sm opacity-90">
                  {dateLabel(next.date)} · {next.time}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary-foreground/10 p-3">
                    <p className="text-xs opacity-80">Your token</p>
                    <p className="font-display text-xl font-bold">{next.token}</p>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 p-3">
                    <p className="text-xs opacity-80">Now serving</p>
                    <p className="font-display text-xl font-bold">{current || "—"}</p>
                  </div>
                </div>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link to="/patient/track/$id" params={{ id: next.id }}>
                    Track live status
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-border">
            <CardContent className="p-5">
              <p className="font-semibold">Before you visit</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Carry your CareTrack token number and a photo ID.</li>
                <li>Reach the OPD counter 10 minutes before your slot to check in.</li>
                <li>Bring previous prescriptions and lab reports if any.</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
