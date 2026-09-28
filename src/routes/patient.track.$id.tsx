import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Check, Loader2, MapPin, RefreshCw, Ticket } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/status-badge";
import { LiveQueuePanel } from "@/components/live-queue-panel";
import { useApp } from "@/lib/app-store";
import { dateLabel } from "@/lib/format";
import { TRACK_STAGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/patient/track/$id")({
  head: () => ({
    meta: [
      { title: "Track Appointment — CareTrack" },
      {
        name: "description",
        content:
          "Live OPD queue tracking: token number, current token, stage and estimated waiting time.",
      },
      { property: "og:title", content: "Track Appointment — CareTrack" },
      { property: "og:description", content: "Follow your token through the OPD queue in real time." },
    ],
  }),
  component: TrackAppointment,
});

const STAGE_HINT: Record<string, string> = {
  Confirmed: "Slot reserved. Report to the OPD counter to check in.",
  "Checked In": "Registration done. You have been added to the doctor's queue.",
  Waiting: "You are in the queue. Please wait near the OPD room.",
  "With Doctor": "Consultation in progress.",
  Completed: "Visit complete. Notes and prescription are in your history.",
};

function TrackAppointment() {
  const { id } = useParams({ from: "/patient/track/$id" });
  const { appointments, doctors, advance } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const appt = appointments.find((a) => a.id === id);
  const doctor = doctors.find((d) => d.id === appt?.doctorId);

  if (!appt || !doctor) {
    return (
      <AppShell title="Appointment not found">
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <p className="font-medium">Nothing to track here</p>
            <Button className="mt-4" asChild>
              <Link to="/patient">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const cancelled = appt.status === "Cancelled";
  const stageIndex = TRACK_STAGES.indexOf(appt.status);
  
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      if (stageIndex >= 0 && stageIndex < TRACK_STAGES.length - 1) {
        advance(appt.id);
        toast.success(`Status updated to ${TRACK_STAGES[stageIndex + 1]}`);
      } else {
        toast("Status is up to date");
      }
    }, 800);
  };

  return (
    <AppShell
      title="Track appointment"
      subtitle={`${doctor.name} · ${dateLabel(appt.date)} at ${appt.time}`}
      action={
        <Button onClick={refresh} disabled={refreshing || cancelled} variant="outline">
          {refreshing ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 size-4" />
          )}
          Refresh status
        </Button>
      }
    >
      <div className="mb-6">
        <LiveQueuePanel appt={appt} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate text-lg font-semibold">Current status</h2>
              <StatusBadge status={appt.status} />
            </div>

            {cancelled ? (
              <p className="mt-4 text-sm text-muted-foreground">
                This appointment was cancelled. Book a new slot to start tracking again.
              </p>
            ) : (
              <>
                <Progress
                  value={((stageIndex + 1) / TRACK_STAGES.length) * 100}
                  className="mt-5"
                />
                <ol className="mt-6 space-y-5">
                  {TRACK_STAGES.map((stage, i) => {
                    const done = i <= stageIndex;
                    const active = i === stageIndex;
                    return (
                      <li key={stage} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                            done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-muted-foreground",
                          )}
                        >
                          {done ? <Check className="size-4" /> : i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className={cn("font-medium", !done && "text-muted-foreground")}>
                            {stage}
                          </p>
                          <p className="text-sm text-muted-foreground">{STAGE_HINT[stage]}</p>
                          {active && (
                            <span className="mt-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent-foreground">
                              Current stage
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border-border">
            <CardContent className="space-y-3 p-5 text-sm">
              <p className="font-semibold">Appointment details</p>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Doctor</span>
                <span className="text-right font-medium">{doctor.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{doctor.department}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{dateLabel(appt.date)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{appt.time}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Ticket className="size-4" /> Token
                </span>
                <span className="font-medium">{appt.token}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4" /> Room
                </span>
                <span className="font-medium">{doctor.room}</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/patient/history">Appointment history</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
